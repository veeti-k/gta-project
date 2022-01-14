using Backend.Api.Models;

namespace Backend.Api.Repositories;

public interface IModelCarRepo
{
  public IEnumerable<ModelCar> GetAll();
  public Task<ModelCar> GetById(Guid id);

  public Task Add(ModelCar modelCar);

  public Task Update();
}