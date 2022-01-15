using Backend.Api.Models;
using Backend.Api.Repositories;

namespace Backend.Api.Data;

public class UnitOfWork : IUnitOfWork
{
  private readonly DataContext _context;

  public UnitOfWork(DataContext aContext, 
    IGenericRepo<User> aUserRepo, 
    IGenericRepo<ModelCar> aModelCarRepo, 
    IGenericRepo<ModelGarage> aModelGarageRepo, 
    IGenericRepo<Garage> aGarageRepo,
    IGenericRepo<Car> aCarRepo)
  {
    _context = aContext;
    UserRepo = aUserRepo;
    ModelCarRepo = aModelCarRepo;
    ModelGarageRepo = aModelGarageRepo;
    GarageRepo = aGarageRepo;
    CarRepo = aCarRepo;
  }

  public IGenericRepo<User> UserRepo { get; }

  public IGenericRepo<ModelCar> ModelCarRepo { get; }
  
  public IGenericRepo<Garage> GarageRepo { get; }
  
  public IGenericRepo<ModelGarage> ModelGarageRepo { get; }
  
  public IGenericRepo<Car> CarRepo { get; }

  public async Task SaveChangesAsync()
  {
    await _context.SaveChangesAsync();
  }
}