namespace Backend.Api.Dtos;

public record ChangeEmailDto
{
  public Guid UserId { get; init; }
  public string NewEmail { get; init; }
}

public record VerifyEmailDto
{
  public string Token { get; init; }
}

public record ResendEmailDto
{
  public Guid UserId { get; init; }
}