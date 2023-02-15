using AutoMapper;
using Business.Services;
using Business.Services.Default;
using DataAccess.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Logging;
using Microsoft.IdentityModel.Tokens;
using Nordlo.NetworkConfigurationManager.Config;
using System.Text;
using System.Text.Json.Serialization;
using WestCoastEducation.Auth;
using WestCoastEducation.Helpers;

var builder = WebApplication.CreateBuilder(args);
ConfigurationManager configuration = builder.Configuration;


// For Entity Framework
builder.Services.AddDbContext<ApplicationDbContext>(options => options.UseSqlServer(configuration["IdentityDatabase:ConnectionString"]));

//Add JwtConfig
builder.Services.AddScoped<IJwtUtils, JwtUtils>();
JwtConfig jwtConfig = configuration.GetSection(nameof(JwtConfig)).Get<JwtConfig>();
builder.Services.AddSingleton(jwtConfig);

// For Identity
builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

builder.Services.Configure<RouteOptions>(options => options.LowercaseUrls = true);

// Adding Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.SaveToken = true;
    options.Authority = "https://localhost:7253/api/authenticate";
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidAudience = jwtConfig.Audience,
        ValidIssuer = jwtConfig.Issuer,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtConfig.Secret)),
        ClockSkew = TimeSpan.FromSeconds(1),
        RequireExpirationTime = true,
        ValidateLifetime = true,
    };
});


builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


builder.Services.AddDbContext<BookstoreContext>(options => options.UseSqlServer(configuration["BookstoreDatabase:ConnectionString"]));

builder.Services.AddScoped<IJwtUtils, JwtUtils>();
builder.Services.AddScoped<IBookService, BookService>();

var config = new MapperConfiguration(cfg =>
{
    cfg.AddProfile(new Business.AutoMapperProfile());
});
var mapper = config.CreateMapper();
builder.Services.AddSingleton(mapper);

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.MapControllers();

app.UseCors(options =>
       options.WithOrigins(configuration["Cors:AllowedOrigins"])
           .AllowAnyOrigin()
    .AllowAnyMethod()
    .AllowAnyHeader());

app.UseAuthentication();

app.UseAuthorization();

app.Run();
