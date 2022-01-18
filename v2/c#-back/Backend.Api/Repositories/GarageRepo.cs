using System.Linq.Expressions;
using Backend.Api.CarDtos;
using Backend.Api.Data;
using Backend.Api.GarageDtos;
using Backend.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Api.Repositories;

public class GarageRepo : GenericRepo<Garage>, IGarageRepo
{
  private readonly DataContext _context;

  public GarageRepo(DataContext context) : base(context)
  {
    _context = context;
  }

  public async Task<IEnumerable<JoinedGarageDto>> GetManyByFilter(Expression<Func<JoinedGarageDto, bool>> aFilter)
  {
    return await _context.Garages
      .Include(garage => garage.ModelGarage)
      .Include(garage => garage.Cars)
      .ThenInclude(car => car.ModelCar)
      .Select(garage => new JoinedGarageDto()
      {
        Id = garage.Id,
        Desc = garage.Desc,
        Name = garage.ModelGarage.Name,
        Type = garage.ModelGarage.Type,
        Capacity = garage.ModelGarage.Capacity,
        OwnerId = garage.OwnerId,
        Cars = garage.Cars.Select(car => new JoinedCarDto()
        {
          Id = car.Id,
          Name = car.ModelCar.Name,
          Manufacturer = car.ModelCar.Manufacturer,
          Class = car.ModelCar.Class,
          OwnerId = car.OwnerId,
          Garage = new PartialGarageDto()
          {
            Id = garage.Id,
            Name = garage.ModelGarage.Name,
            Desc = garage.Desc,
            Capacity = garage.ModelGarage.Capacity,
            Type = garage.ModelGarage.Type
          }
        })
      })
      .ToListAsync();
  }
  public async Task<JoinedGarageDto> GetOneByFilter(Expression<Func<JoinedGarageDto, bool>> aFilter)
  {
    return await _context.Garages
      .Include(garage => garage.ModelGarage)
      .Include(garage => garage.Cars)
      .ThenInclude(car => car.ModelCar)
      .Select(garage => new JoinedGarageDto()
      {
        Id = garage.Id,
        Desc = garage.Desc,
        Name = garage.ModelGarage.Name,
        Type = garage.ModelGarage.Type,
        Capacity = garage.ModelGarage.Capacity,
        OwnerId = garage.OwnerId,
        Cars = garage.Cars.Select(car => new JoinedCarDto()
        {
          Id = car.Id,
          Name = car.ModelCar.Name,
          Manufacturer = car.ModelCar.Manufacturer,
          Class = car.ModelCar.Class,
          OwnerId = car.OwnerId,
          Garage = new PartialGarageDto()
          {
            Id = garage.Id,
            Name = garage.ModelGarage.Name,
            Desc = garage.Desc,
            Capacity = garage.ModelGarage.Capacity,
            Type = garage.ModelGarage.Type
          }
        })
      })
      .SingleAsync(aFilter);
  }
}