using Backend.Api.Configs;
using Backend.Api.Data;
using Backend.Api.Repositories;
using Microsoft.EntityFrameworkCore;
using Backend.Api.Helpers;
using Backend.Api.Models;
using Backend.Api.Repositories.ModelCar;
using Backend.Api.Repositories.ModelGarage;
using Backend.Api.TokenDtos;
using Microsoft.Extensions.Options;
using Prometheus;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddDbContext<DataContext>(options =>
  options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IDataContext, DataContext>();
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
builder.Services.AddTransient<IMailing, Mailing>();

builder.Services.AddRouting(options => options.LowercaseUrls = true);

builder.Services.Configure<JwtConfig>(builder.Configuration.GetSection("JWT_Config"));

builder.Services.Configure<CookieConfig>(builder.Configuration.GetSection("CookieConfig"));
builder.Services.Configure<EmailConfig>(builder.Configuration.GetSection("EmailConfig"));

var app = builder.Build();

app.MapControllers();
app.UseRouting();

app.Map("/metrics", appBuilder =>
{
  appBuilder.Use(async (aContext, next) =>
  {
    var rightPass = builder.Configuration.GetValue<string>("MetricsPass");
    var pass = aContext.Request.Headers.Authorization;

    if (pass != rightPass)
    {
      aContext.Response.StatusCode = 401;
      return;
    }

    await next();
  });

  appBuilder.UseEndpoints(endpoints => endpoints.MapMetrics());
});

app.UseHttpMetrics();

app.Run("http://0.0.0.0:5000");