using AutoMapper;
using Business.Dtos.Books;
using Business.Dtos.Comments;
using Business.Repositories;
using Business.Repositories.Default;
using DataAccess.Data;
using Google.Cloud.Firestore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;
using WestCoastEducation.Auth;
using WestCoastEducation.Config;
using WestCoastEducation.Endpoints;
using WestCoastEducation.EndPoints;
using WestCoastEducation.Helpers;
using WestCoastEducation.Hubs;
using WestCoastEducation.Infrastructure;

var builder = WebApplication.CreateBuilder(args);
ConfigurationManager configuration = builder.Configuration;

//Add JwtConfig
AuthConfig authConfig = configuration.GetSection(nameof(AuthConfig)).Get<AuthConfig>();
builder.Services.AddSingleton(authConfig);

//AutoMapper
var config = new MapperConfiguration(cfg =>
{
    cfg.AddProfile(new Business.AutoMapperProfile());
});
var mapper = config.CreateMapper();
builder.Services.AddSingleton(mapper);

// For Entity Framework
builder.Services.AddDbContext<ApplicationDbContext>(options => options.UseSqlServer(configuration.GetConnectionString(ConstantsConfig.IdentityDatabase)));
builder.Services.AddDbContext<BookstoreContext>(options => options.UseSqlServer(configuration.GetConnectionString(ConstantsConfig.BookstoreDatabase)));

//Swagger configuration in case of dev mode
builder.Services.AddSwaggerConfiguration(configuration);

//Lowercase urls
builder.Services.Configure<RouteOptions>(options => options.LowercaseUrls = true);

//Memory Caching
builder.Services.AddMemoryCache();

//Dependency Inject Services
builder.Services.AddScoped<IJwtUtils, JwtUtils>();
builder.Services.AddScoped<IRepository<BookDto, BookBriefDto>, BookRepository>();
builder.Services.AddScoped<IRepository<CommentDto, CommentBriefDto>, CommentRepository>();

// For Identity
builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

//Avoid object cycle
builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
});

// Adding Authentication
builder.Services.AddJwtAuthentication(authConfig);
builder.Services.AddCookieAuthentication(authConfig);
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy(UserRoles.Admin, policy => policy.RequireRole(UserRoles.Admin));
    options.DefaultPolicy = new AuthorizationPolicyBuilder()
           .RequireAuthenticatedUser()
           .Build();
});

//Add Firestore
string environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
string fileName = environment == "Development" ? "firestore.Development.json" : "firestore.json";
string firestoreJson = File.ReadAllText(fileName);
var fireStore = new FirestoreDbBuilder
{
    ProjectId = configuration.GetValue<string>(ConstantsConfig.FirestoreProjectId),
    JsonCredentials = firestoreJson
}.Build();
builder.Services.AddSingleton(fireStore);

//Add SignalR for the commentsHub
builder.Services.AddSignalR();

//AddSpa
builder.Services.AddSpaStaticFiles(configuration =>
{
    configuration.RootPath = "ClientApp/dist";
});

// Create the IServiceProvider instance
IServiceProvider serviceProvider = builder.Services.BuildServiceProvider();

// Initialize the ServiceLocator
ServiceLocator.Initialize(serviceProvider);

var app = builder.Build();

//Add SignalR for the commentsHub
app.MapHub<CommentHub>("/api/hubs/commenthub");

//Mapping endpoints
app.MapAuthEndpoints();
app.MapBookEndpoints();

if (app.Environment.IsDevelopment())
{
    app.UseSwaggerConfiguration();
}
else
{
    app.UseSpaConfiguration();
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.Run();