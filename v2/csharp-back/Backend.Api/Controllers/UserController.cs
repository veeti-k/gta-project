﻿using Backend.Api.Attributes;
using Backend.Api.Dtos.UserDtos;
using Backend.Api.Models;
using Backend.Api.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Api.Controllers;

[ApiController]
[Route("api/users")]
public class UserController : ControllerBase
{
  private readonly IUserRepo _db;

  public UserController(IUserRepo aUserRepo)
  {
    _db = aUserRepo;
  }

  [HttpGet("me")]
  [Authorization.CustomAuth("Standard, Admin")]
  public async Task<ActionResult<ReturnUserDto>> GetMe()
  {
    var goodUserId = Guid.TryParse(HttpContext.Items["userId"].ToString(),
      out var userId);
    if (!goodUserId) return Unauthorized("bad userId");

    var user = await _db.GetOne(userId);
    if (user == null) return NotFound();

    ReturnUserDto returnUser = new()
    {
      Id = user.Id,
      Username = user.Username,
      Email = user.Email,
      Role = user.Role,
      GarageCount = user.Garages.Count,
      CarCount = user.Cars.Count
    };

    return Ok(returnUser);
  }

  [HttpGet("{id:Guid}")]
  [Authorization.CustomAuth("Admin")]
  public async Task<ActionResult<ReturnUserDto>> GetOne(Guid id)
  {
    var user = await _db.GetOne(id);
    if (user == null) return NotFound();

    ReturnUserDto returnUser = new()
    {
      Id = user.Id,
      Username = user.Username,
      Email = user.Email,
      Role = user.Role,
      GarageCount = user.Garages.Count,
      CarCount = user.Cars.Count
    };

    return Ok(returnUser);
  }

  [HttpGet]
  [Authorization.CustomAuth("Admin")]
  public async Task<ActionResult<IEnumerable<User>>> GetAll()
  {
    var users = await _db.GetMany();

    return Ok(users);
  }

  [HttpPatch("{id:Guid}")]
  [Authorization.CustomAuth("Admin")]
  public async Task<ActionResult<ReturnUserDto>> UpdateRole(Guid id, UpdateUserDto aUserDto)
  {
    var existingUser = await _db.GetOneByFilterTracking(user => user.Id == id);
    if (existingUser == null) return NotFound();

    existingUser.Role = aUserDto.NewRole;

    await _db.Save();

    ReturnUserDto returnUser = new()
    {
      Id = existingUser.Id,
      Username = existingUser.Username,
      Role = existingUser.Role
    };

    return Ok(returnUser);
  }

  [HttpDelete("{id:Guid}")]
  [Authorization.CustomAuth("Admin")]
  public async Task<ActionResult<string>> Delete(Guid id)
  {
    var userToDelete = await _db.GetOneByFilter(u => u.Id == id);
    if (userToDelete == null) return NotFound("user was not found");

    _db.Delete(userToDelete);
    await _db.Save();

    return NoContent();
  }
}