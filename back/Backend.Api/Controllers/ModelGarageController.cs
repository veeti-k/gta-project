using Backend.Api.Attributes;
using Backend.Api.Helpers;
using Backend.Api.Dtos;
using Backend.Api.Models;
using Backend.Api.Repositories;
using Backend.Api.Repositories.ModelGarage;
using JetBrains.Annotations;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Api.Controllers;

[ApiController]
[Route("api/modelgarages")]
public class ModelGarageController : ControllerBase
{
  private readonly IModelGarageRepo _modelGarageRepo;
  private readonly IGarageRepo _garageRepo;

  public ModelGarageController(
    IModelGarageRepo aModelGarageRepo,
    IGarageRepo aGarageRepo
  )
  {
    _garageRepo = aGarageRepo;
    _modelGarageRepo = aModelGarageRepo;
  }

  [HttpGet]
  [Authorization.CustomAuth("Standard, Admin")]
  public async Task<ActionResult<IEnumerable<ReturnModelGarageDto>>> GetAll([CanBeNull] string query)
  {
    var goodUserId = Guid.TryParse(HttpContext.Items["userId"].ToString(),
      out var userId);
    if (!goodUserId) return Unauthorized("bad userId");
    
    if (query != null)
      query = Sanitize.GetGoodQuery(query);

    var modelGarages = await _modelGarageRepo.GetMatching(query);
    var garages = await _garageRepo
      .GetManyByFilter(garage => garage.OwnerId == userId);

    var toReturn = modelGarages
      .Select(modelGarage => new ReturnModelGarageDto()
      {
        Id = modelGarage.Id,
        Name = modelGarage.Name,
        Capacity = modelGarage.Capacity,
        AlreadyOwned = garages.Any(garage => garage.ModelGarageId == modelGarage.Id)
      });

    if (query == null) return Ok(toReturn);

    var results = Search.GetResults(toReturn, query);

    return Ok(results.Take(5));
  }

  [HttpGet("{id:Guid}")]
  [Authorization.CustomAuth("Standard, Admin")]
  public async Task<ActionResult<ModelGarage>> GetById(Guid id)
  {
    var found = await _modelGarageRepo.GetOneByFilter(garage => garage.Id == id);
    if (found == null) return NotFound("model garage was not found");

    return Ok(found);
  }

  [HttpPost]
  [Authorization.CustomAuth("Admin")]
  public async Task<ActionResult<ModelGarage>> Add(ModelGarageDto aDto)
  {
    var existing = await _modelGarageRepo.GetOneByFilter(garage => garage.Name == aDto.Name);
    if (existing != null)
      return Conflict(existing);
    if (HttpContext.Items["emailVerified"] as string == "False") return BadRequest("Email must be verified");

    ModelGarage newModelGarage = new()
    {
      Id = Guid.NewGuid(),
      Name = aDto.Name,
      Capacity = aDto.Capacity,
    };

    _modelGarageRepo.Add(newModelGarage);
    await _modelGarageRepo.Save();

    return Ok(newModelGarage);
  }

  [HttpPatch("{id:Guid}")]
  [Authorization.CustomAuth("Admin")]
  public async Task<ActionResult<ModelGarage>> Update(Guid id, ModelGarageDto aDto)
  {
    var existing = await _modelGarageRepo.GetOneByFilterTracking(garage => garage.Id == id);
    if (existing == null) return NotFound();
    if (HttpContext.Items["emailVerified"] as string == "False") return BadRequest("Email must be verified");

    existing.Name = aDto.Name;
    existing.Capacity = aDto.Capacity;

    await _modelGarageRepo.Save();

    return Ok(existing);
  }
}