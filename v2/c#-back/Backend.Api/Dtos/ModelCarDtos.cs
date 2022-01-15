namespace Backend.Api.ModelCarDtos;

public record ModelCarDto
{
  public string Name { get; init; }

  public string Manufacturer { get; init; }

  public string Class { get; init; }
}