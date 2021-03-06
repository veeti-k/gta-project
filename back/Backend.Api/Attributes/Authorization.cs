using System.Security.Claims;
using Backend.Api.Helpers;
using Backend.Api.Models;
using Backend.Api.Repositories;
using Backend.Api.Dtos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Backend.Api.Configs;

namespace Backend.Api.Attributes;

public class Authorization
{
  public class CustomAuth : TypeFilterAttribute
  {
    public CustomAuth(string claimValue) : base(typeof(ClaimRequirementFilter))
    {
      Arguments = new object[] { new Claim(ClaimTypes.Role, claimValue) };
    }
  }

  public class ClaimRequirementFilter : IAsyncAuthorizationFilter
  {
    private readonly Claim _claim;
    private readonly IJwt _jwt;
    private readonly IGenericRepo<User> _userRepo;

    public ClaimRequirementFilter(
      IJwt jwt,
      Claim claim,
      IGenericRepo<User> aUserRepo
    )
    {
      _jwt = jwt;
      _claim = claim;
      _userRepo = aUserRepo;
    }

    public async Task OnAuthorizationAsync(AuthorizationFilterContext context)
    {
      ValidTokenDto accessToken = null;

      try
      {
        var accessTokenFromHeader = context.HttpContext.Request.Headers.Authorization.ToString().Split(" ")[1];
        if (accessTokenFromHeader.StartsWith("ey"))
        {
          accessToken = _jwt.ValidateAccessToken(accessTokenFromHeader);

          if (accessToken == null)
          {
            HandleUnauthorized(context, "invalid access token");
            return;
          }
        }
      }
      catch
      {
        HandleUnauthorized(context, "invalid access token");
        return;
      }

      if (accessToken == null)
      {
        HandleUnauthorized(context, "invalid access token");
        return;
      }

      var user = await _userRepo.GetOneByFilter(user => user.Id == accessToken.UserId);
      if (user == null)
      {
        HandleUnauthorized(context, "no user found");
        return;
      }

      var matches = TokenMatchesWithDb(accessToken, user);
      if (!matches)
      {
        HandleUnauthorized(context, "invalid user in token");
        return;
      }

      context.HttpContext.Items["userId"] = user.Id;
      context.HttpContext.Items["emailVerified"] = (user.EmailVerifyToken == null).ToString();

      var hasCorrectRole = _claim.Value.Contains(accessToken.Role);
      if (!hasCorrectRole)
      {
        context.Result = new ForbidResult();
        return;
      }
    }

    private static bool TokenMatchesWithDb(ValidTokenDto aToken, User aDbData)
    {
      if (aDbData.TokenVersion != aToken.TokenVersion) return false;
      if (aDbData.Role != aToken.Role) return false;
      if (aDbData.Username != aToken.Username) return false;
      if (aDbData.Email != aToken.Email) return false;

      return true;
    }

    private void HandleUnauthorized(AuthorizationFilterContext context, string message)
    {
      Console.WriteLine($"unauthorized {message}");
      context.Result = new UnauthorizedObjectResult(message);
    }
  }
}