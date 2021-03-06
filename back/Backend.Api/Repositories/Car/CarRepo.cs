using System.Linq.Expressions;
using Backend.Api.Data;
using Backend.Api.Dtos;
using Backend.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Api.Repositories;

public class CarRepo : GenericRepo<Car>, ICarRepo
{
  private readonly DataContext _context;

  public CarRepo(DataContext context) : base(context)
  {
    _context = context;
  }

  public async Task<IEnumerable<JoinedCarDto>> GetMatching(Guid userId, string aQuery = null)
  {
    var dbQuery = _context.Cars
      .AsNoTracking()
      .Include(car => car.ModelCar)
      .Include(car => car.Garage)
      .ThenInclude(garage => garage.ModelGarage)
      .Select(car => new JoinedCarDto()
      {
        Id = car.Id,
        Name = car.ModelCar.Name,
        Manufacturer = car.ModelCar.Manufacturer,
        Class = car.ModelCar.Class,
        OwnerId = car.OwnerId,
        Garage = new PartialGarageDto()
        {
          Id = car.Garage.Id,
          Desc = car.Garage.Desc,
          Name = car.Garage.ModelGarage.Name,
          Capacity = car.Garage.ModelGarage.Capacity,
          Full = car.Garage.Cars.Count >= car.Garage.ModelGarage.Capacity,
          Room = car.Garage.ModelGarage.Capacity - car.Garage.Cars.Count,
        }
      })
      .Where(car => car.OwnerId == userId);

    if (aQuery == null)
    {
      return await dbQuery.ToListAsync();
    }

    return await dbQuery
      .Where(car => car.Name.ToLower().Contains(aQuery) ||
                    car.Manufacturer.ToLower().Contains(aQuery) ||
                    car.Garage.Name.ToLower().Contains(aQuery) ||
                    car.Garage.Desc.ToLower().Contains(aQuery))
      .ToListAsync();
  }

  public async Task<IEnumerable<JoinedCarDto>> GetManyJoinedByFilter(Expression<Func<JoinedCarDto, bool>> aFilter)
  {
    return await _context.Cars
      .AsNoTracking()
      .Include(car => car.ModelCar)
      .Include(car => car.Garage)
      .ThenInclude(garage => garage.ModelGarage)
      .Select(car => new JoinedCarDto()
      {
        Id = car.Id,
        Name = car.ModelCar.Name,
        Manufacturer = car.ModelCar.Manufacturer,
        Class = car.ModelCar.Class,
        OwnerId = car.OwnerId,
        Garage = new PartialGarageDto()
        {
          Id = car.Garage.Id,
          Desc = car.Garage.Desc,
          Name = car.Garage.ModelGarage.Name,
          Capacity = car.Garage.ModelGarage.Capacity,
          Full = car.Garage.Cars.Count >= car.Garage.ModelGarage.Capacity,
          Room = car.Garage.ModelGarage.Capacity - car.Garage.Cars.Count,
        }
      })
      .Where(aFilter)
      .ToListAsync();
  }

  public async Task<JoinedCarDto> GetOneJoinedByFilter(Expression<Func<JoinedCarDto, bool>> aFilter)
  {
    return await _context.Cars
      .AsNoTracking()
      .Include(car => car.ModelCar)
      .Include(car => car.Garage)
      .ThenInclude(garage => garage.ModelGarage)
      .Select(car => new JoinedCarDto()
      {
        Id = car.Id,
        Name = car.ModelCar.Name,
        Manufacturer = car.ModelCar.Manufacturer,
        Class = car.ModelCar.Class,
        OwnerId = car.OwnerId,
        Garage = new PartialGarageDto()
        {
          Id = car.Garage.Id,
          Desc = car.Garage.Desc,
          Name = car.Garage.ModelGarage.Name,
          Capacity = car.Garage.ModelGarage.Capacity,
          Full = car.Garage.Cars.Count >= car.Garage.ModelGarage.Capacity,
          Room = car.Garage.ModelGarage.Capacity - car.Garage.Cars.Count,
        }
      })
      .SingleAsync(aFilter);
  }
}