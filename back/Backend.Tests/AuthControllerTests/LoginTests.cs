using System;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Backend.Api.Configs;
using Backend.Api.Controllers;
using Backend.Api.Dtos;
using Backend.Api.Helpers;
using Backend.Api.Models;
using Backend.Api.Repositories;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Moq;
using Xunit;

namespace Backend.Tests.AuthControllerTests;

public class LoginTests
{
  private readonly IJwt _jwt;
  private readonly IMisc _fakeMisc;
  private readonly Mock<IMailing> _fakeMailing = new();
  private readonly Mock<IGenericRepo<User>> _fakeUserRepo = new();

  private readonly IOptions<JwtConfig> _jwtConfig = Options.Create<JwtConfig>(
    new JwtConfig()
    {
      Refresh_Secret = Guid.NewGuid().ToString(),
      Refresh_Iss = "test-refresh-iss",
      Refresh_Aud = "test-refresh-aud",

      Access_Secret = Guid.NewGuid().ToString(),
      Access_Iss = "test-access-iss",
      Access_Aud = "test-access-aud"
    });


  public LoginTests()
  {
    _jwt = new Jwt(_jwtConfig);
    _fakeMisc = new Misc(_jwtConfig);
  }

  [Fact]
  public async Task Login_WithCorrectCredentials_AndExistingUser_SetsCorrectHeaders()
  {
    var clearText = Guid.NewGuid().ToString();
    var hash = Hashing.HashToString(clearText);

    var authDto = CreateFakeAuthUser(clearText);
    User existingUser = new()
    {
      Id = Guid.NewGuid(),
      Email = Guid.NewGuid().ToString(),
      Username = authDto.UsernameOrEmail,
      Password = hash,
      Role = Guid.NewGuid().ToString(),
      TokenVersion = Guid.NewGuid(),
      IsTestAccount = false,
      EmailVerifyToken = Guid.NewGuid().ToString()
    };

    _fakeUserRepo.Setup(repo => repo
        .GetOneByFilter(It.IsAny<Expression<Func<User, bool>>>()))
      .ReturnsAsync(existingUser);

    var fakeContext = new DefaultHttpContext();
    var controller = new AuthController(_jwt, _fakeMisc, _fakeMailing.Object, _fakeUserRepo.Object)
    {
      ControllerContext = new ControllerContext()
      {
        HttpContext = fakeContext
      }
    };

    var result = await controller.Login(authDto);

    var resRefreshToken = fakeContext.Response.Headers.SetCookie.ToString().Split("=")[1].Split(";")[0];
    var resAccessToken = fakeContext.Response.Headers[CookieConfig.AccessTokenHeader].ToString();

    var refreshToken = _jwt.ValidateRefreshToken(resRefreshToken);
    var accessToken = _jwt.ValidateAccessToken(resAccessToken);

    result.Result.Should().BeOfType<NoContentResult>();

    refreshToken.Email.Should().Be(existingUser.Email);
    refreshToken.Username.Should().Be(authDto.UsernameOrEmail);
    refreshToken.TokenVersion.Should().Be(existingUser.TokenVersion);
    refreshToken.Role.Should().Be(existingUser.Role);
    refreshToken.EmailVerified.Should().Be(false);
    refreshToken.IsTestAccount.Should().Be(false);

    accessToken.Email.Should().Be(existingUser.Email);
    accessToken.Username.Should().Be(authDto.UsernameOrEmail);
    accessToken.TokenVersion.Should().Be(existingUser.TokenVersion);
    accessToken.Role.Should().Be(existingUser.Role);
    accessToken.EmailVerified.Should().Be(false);
    accessToken.IsTestAccount.Should().Be(false);
  }

  [Fact]
  public async Task Login_WithUserNotFound_ReturnsNotFound_DoesntSetHeaders()
  {
    var authDto = CreateFakeAuthUser(Guid.NewGuid().ToString());

    _fakeUserRepo.Setup(repo => repo
        .GetOneByFilter(It.IsAny<Expression<Func<User, bool>>>()))
      .ReturnsAsync((User)null);

    var fakeContext = new DefaultHttpContext();
    var controller = new AuthController(_jwt, _fakeMisc, _fakeMailing.Object, _fakeUserRepo.Object)
    {
      ControllerContext = new ControllerContext()
      {
        HttpContext = fakeContext
      }
    };

    var result = await controller.Login(authDto);

    var resRefreshToken = fakeContext.Response.Headers.SetCookie;
    var resAccessToken = fakeContext.Response.Headers[CookieConfig.AccessTokenHeader];

    resRefreshToken.Should().BeEmpty();
    resAccessToken.Should().BeEmpty();

    result.Result.Should().BeOfType<BadRequestObjectResult>();
    (result.Result as BadRequestObjectResult).Value.Should().Be("Incorrect credentials");
  }

  [Fact]
  public async Task Login_WithIncorrectCredentials_ReturnsUnauthorized_DoesntSetHeaders()
  {
    var authDto = CreateFakeAuthUser(Guid.NewGuid().ToString());
    User existingUser = new()
    {
      Id = Guid.NewGuid(),
      Email = Guid.NewGuid().ToString(),
      Username = authDto.UsernameOrEmail,
      Password = Hashing.HashToString(Guid.NewGuid().ToString()),
      Role = Guid.NewGuid().ToString(),
      TokenVersion = Guid.NewGuid(),
      IsTestAccount = false,
      EmailVerifyToken = Guid.NewGuid().ToString()
    };

    _fakeUserRepo.Setup(repo => repo
        .GetOneByFilter(It.IsAny<Expression<Func<User, bool>>>()))
      .ReturnsAsync(existingUser);

    var fakeContext = new DefaultHttpContext();
    var controller = new AuthController(_jwt, _fakeMisc, _fakeMailing.Object, _fakeUserRepo.Object)
    {
      ControllerContext = new ControllerContext()
      {
        HttpContext = fakeContext
      }
    };

    var result = await controller.Login(authDto);

    var resRefreshToken = fakeContext.Response.Headers.SetCookie;
    var resAccessToken = fakeContext.Response.Headers[CookieConfig.AccessTokenHeader];

    resRefreshToken.Should().BeEmpty();
    resAccessToken.Should().BeEmpty();

    result.Result.Should().BeOfType<BadRequestObjectResult>();
    (result.Result as BadRequestObjectResult).Value.Should().Be("Incorrect credentials");
  }

  private User CreateFakeUser(string? hash = null)
  {
    return new()
    {
      Id = Guid.NewGuid(),
      Email = Guid.NewGuid().ToString(),
      Username = Guid.NewGuid().ToString(),
      Password = hash ?? Hashing.HashToString(Guid.NewGuid().ToString()),
      Role = Guid.NewGuid().ToString(),
      TokenVersion = Guid.NewGuid(),
      EmailVerifyToken = Guid.NewGuid().ToString()
    };
  }

  private static AuthUserDto CreateFakeAuthUser(string password)
  {
    return new()
    {
      UsernameOrEmail = Guid.NewGuid().ToString(),
      Password = password
    };
  }

  private static RegisterUserDto CreateFakeRegisterUser()
  {
    return new()
    {
      Email = Guid.NewGuid().ToString(),
      Username = Guid.NewGuid().ToString(),
      Password = Guid.NewGuid().ToString(),
    };
  }
}