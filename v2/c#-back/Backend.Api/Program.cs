using Backend.Api;
using Backend.Api.Data;
using Backend.Api.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Backend.Api.Helpers;
using Backend.Api.Models;
using Backend.Api.Repositories.ModelCar;
using Backend.Api.Repositories.ModelGarage;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddDbContext<DataContext>(options =>
  options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddTransient<IDataContext, DataContext>();
builder.Services.AddScoped<IGenericRepo<User>, GenericRepo<User>>();
builder.Services.AddScoped<IGenericRepo<ModelCar>, GenericRepo<ModelCar>>();
builder.Services.AddScoped<IGenericRepo<ModelGarage>, GenericRepo<ModelGarage>>();
builder.Services.AddScoped<IGenericRepo<Garage>, GenericRepo<Garage>>();
builder.Services.AddScoped<IGenericRepo<Car>, GenericRepo<Car>>();

builder.Services.AddScoped<ICarRepo, CarRepo>();
builder.Services.AddScoped<IGarageRepo, GarageRepo>();
builder.Services.AddScoped<IModelCarRepo, ModelCarRepo>();
builder.Services.AddScoped<IModelGarageRepo, ModelGarageRepo>();
builder.Services.AddScoped<IUserRepo, UserRepo>();

builder.Services.AddScoped<IJwt, Jwt>();

builder.Services.AddRouting(options => options.LowercaseUrls = true);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
  options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
  {
    Scheme = "Bearer",
    BearerFormat = "JWT",
    In = ParameterLocation.Header,
    Name = "Authorization",
    Description = "Bearer Authentication with JWTs",
    Type = SecuritySchemeType.Http
  });
  options.AddSecurityRequirement(new OpenApiSecurityRequirement
  {
    {
      new OpenApiSecurityScheme
      {
        Reference = new OpenApiReference
        {
          Id = "Bearer",
          Type = ReferenceType.SecurityScheme
        }
      },
      new List<string>()
    }
  });
});

builder.Services.Configure<Settings>(builder.Configuration.GetSection("Settings"));

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();