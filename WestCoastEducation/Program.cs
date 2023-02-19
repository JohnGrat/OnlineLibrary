using AutoMapper;
using Business.Dtos.Books;
using Business.Dtos.Comments;
using Business.Repositories;
using Business.Repositories.Default;
using DataAccess.Data;
using Google.Api;
using Google.Cloud.Firestore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Nordlo.NetworkConfigurationManager.Config;
using System.Reflection;
using System.Text;
using System.Text.Json.Serialization;
using WestCoastEducation.Auth;
using WestCoastEducation.Helpers;
using WestCoastEducation.Hubs;

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


var test = new FirestoreDbBuilder
{
    ProjectId = "cloudchat-fe9dc",
    JsonCredentials = fireStoreCred()
}.Build();

//Add Firestore
builder.Services.AddSingleton(test);



builder.Services.AddSignalR();

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
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidAudience = jwtConfig.Audience,
        ValidIssuer = jwtConfig.Issuer,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtConfig.Secret)),
        ClockSkew = TimeSpan.FromSeconds(1),
        RequireExpirationTime = true,
        ValidateLifetime = true,
    };

    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            var accessToken = context.Request.Query["access_token"];

            // If the request is for our hub...
            var path = context.HttpContext.Request.Path;
            if (!string.IsNullOrEmpty(accessToken) &&
                (path.StartsWithSegments("/hubs/Commenthub")))
            {
                // Read the token out of the query string
                context.Token = accessToken;
            }
            return Task.CompletedTask;
        }
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
builder.Services.AddScoped<IRepository<BookDto, BookBriefDto>, BookRepository>();
builder.Services.AddScoped<IRepository<CommentDto, CommentBriefDto>, CommentRepository>();

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

app.MapHub<CommentHub>("/hubs/Commenthub");

app.MapControllers();


app.UseCors(builder =>
    builder.WithOrigins(configuration["Cors:AllowedOrigins"])
           .AllowCredentials()
           .AllowAnyHeader()
           .AllowAnyMethod());

app.UseAuthentication();

app.UseAuthorization();

app.Run();



static string fireStoreCred()
{
    using Stream? stream = Assembly.GetExecutingAssembly().GetManifestResourceStream("WestCoastEducation.firestore.json");
    using StreamReader reader = new(stream);
    return reader.ReadToEnd();
}