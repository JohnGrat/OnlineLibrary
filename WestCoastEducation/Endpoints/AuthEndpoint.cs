using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using WestCoastEducation.Auth;
using WestCoastEducation.Config;
using WestCoastEducation.Helpers;

namespace WestCoastEducation.EndPoints
{
    public static class AuthEndpoint
    {
        private static readonly UserManager<ApplicationUser> _userManager;
        private static readonly RoleManager<IdentityRole> _roleManager;
        private static readonly IJwtUtils _jwtUtils;
        private static readonly AuthConfig _authConfig;

        static AuthEndpoint()
        {
            // Initialize static fields with injected dependencies
            _userManager = ServiceLocator.GetService<UserManager<ApplicationUser>>();
            _roleManager = ServiceLocator.GetService<RoleManager<IdentityRole>>();
            _jwtUtils = ServiceLocator.GetService<IJwtUtils>();
            _authConfig = ServiceLocator.GetService<AuthConfig>();
        }

        public static WebApplication MapAuthEndpoints(this WebApplication app)
        {
            app.MapPost("/api/auth/register-admin", RegisterAdmin).RequireAuthorization(UserRoles.Admin);
            app.MapPost("/api/auth/revoke-all", RevokeAll).RequireAuthorization(UserRoles.Admin);
            app.MapPost("/api/auth/revoke/{username}", Revoke).RequireAuthorization(UserRoles.Admin);
            app.MapPost("/api/auth/refresh-token", RefreshToken);
            app.MapGet("/api/auth/logout", (HttpRequest request) => Logout(request)).RequireAuthorization();
            app.MapGet("/api/auth/googleexternallogin", (HttpRequest request) => GoogleExternalLogin(request));
            app.MapGet("/api/auth/login", (HttpRequest request) => Login(request));
            app.MapGet("/api/auth/me", (HttpRequest request) => GetCurrentUser(request)).RequireAuthorization();
            return app;
        }

        private static async Task<IResult> RegisterAdmin(RegisterModel model)
        {
            var userExists = await _userManager.FindByNameAsync(model.Username);
            if (userExists != null)
                return Results.BadRequest("user already exists");

            ApplicationUser user = new()
            {
                Email = model.Email,
                SecurityStamp = Guid.NewGuid().ToString(),
                UserName = model.Username
            };
            var result = await _userManager.CreateAsync(user, model.Password);
            if (!result.Succeeded)
                return Results.BadRequest("failed to create");

            if (!await _roleManager.RoleExistsAsync(UserRoles.Admin))
            {
                await _roleManager.CreateAsync(new IdentityRole(UserRoles.Admin));
            }

            if (await _roleManager.RoleExistsAsync(UserRoles.Admin))
            {
                await _userManager.AddToRoleAsync(user, UserRoles.Admin);
            }

            return Results.Ok("User Created");
        }

        private static async Task<IResult> Logout(HttpRequest request)
        {
            var prop = new AuthenticationProperties()
            {
                RedirectUri = "/"
            };
            await request.HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme, prop);
            return Results.Ok();
        }

        private static async Task<IResult> GoogleExternalLogin(HttpRequest request)
        {
            var accessToken = request.Headers["Authorization"].ToString().Split(" ")[1];

            var payload = await _jwtUtils.VerifyGoogleToken(accessToken);
            if (payload == null)
            {
                return Results.BadRequest("Unauthorize");
            }

            var info = new UserLoginInfo("Google", payload.Subject, "Google");
            var user = await _userManager.FindByLoginAsync(info.LoginProvider, info.ProviderKey);
            if (user == null)
            {
                user = await _userManager.FindByEmailAsync(payload.Email);
                if (user == null)
                {
                    ApplicationUser newUser = new()
                    {
                        DisplayName = payload.Name,
                        Picture = payload.Picture,
                        Email = payload.Email,
                        SecurityStamp = Guid.NewGuid().ToString(),
                        UserName = Guid.NewGuid().ToString()
                    };
                    var resultCreate = await _userManager.CreateAsync(newUser);

                    if (await _roleManager.RoleExistsAsync(UserRoles.User))
                    {
                        await _userManager.AddToRoleAsync(newUser, UserRoles.User);
                    }

                    if (!resultCreate.Succeeded)
                    {
                        return Results.BadRequest("Unauthorize");
                    }
                }
                var resultLOgin = await _userManager.AddLoginAsync(user, info);
                if (!resultLOgin.Succeeded)
                {
                    return Results.BadRequest("Unauthorize");
                }
            }

            user.Picture = payload.Picture;
            user.DisplayName = payload.Name;

            var properties = new AuthenticationProperties();
            properties.IsPersistent = true;

            var principal = await CreateClaimsPrincipalFromUser(user);

            await request.HttpContext.SignInAsync(principal, properties);

            return Results.Ok();
        }

        private static async Task<IResult> Login(HttpRequest request)
        {
            if (!request.HttpContext.Request.Headers.TryGetValue("Authorization", out var authHeader)
                || !_jwtUtils.TryExtractClientCredentials(authHeader, out string username, out string password))
            {
                return Results.BadRequest("Unauthorize");
            }

            var user = await _userManager.FindByNameAsync(username);

            if (user != null && await _userManager.CheckPasswordAsync(user, password))
            {
                string newAccessToken = IssueAccessToken(user).Result;
                string refreshToken = IssueRefreshToken(user).Result;

                return Results.Ok(new
                {
                    accessToken = newAccessToken,
                    refreshToken = refreshToken,
                });
            }

            return Results.BadRequest("Unauthorize");
        }

        private static async Task<IResult> RefreshToken(TokenModel tokenModel)
        {
            if (tokenModel is null)
            {
                return Results.BadRequest("Unauthorize");
            }

            string? refreshToken = tokenModel.RefreshToken;

            var user = await _userManager.Users.FirstOrDefaultAsync(u => u.RefreshToken == refreshToken);

            if (user == null || user.RefreshToken != refreshToken || user.RefreshTokenExpiryTime <= DateTime.Now)
            {
                return Results.BadRequest("Unauthorize");
            }

            string newAccessToken = IssueAccessToken(user).Result;
            string newRefreshToken = IssueRefreshToken(user).Result;

            user.RefreshToken = newRefreshToken;
            await _userManager.UpdateAsync(user);

            return Results.Ok(new
            {
                accessToken = newAccessToken,
                refreshToken = newRefreshToken,
            });
        }

        private static async Task<IResult> Revoke(string username)
        {
            var user = await _userManager.FindByNameAsync(username);
            if (user == null) return Results.BadRequest("Invalid user name");

            user.RefreshToken = null;
            await _userManager.UpdateAsync(user);
            return Results.Ok();
        }

        private static async Task<IResult> RevokeAll()
        {
            var users = _userManager.Users.ToList();
            foreach (var user in users)
            {
                user.RefreshToken = null;
                await _userManager.UpdateAsync(user);
            }
            return Results.Ok();
        }

        private static async Task<IResult> GetCurrentUser(HttpRequest request)
        {
            var user = await _userManager.FindByIdAsync(request.HttpContext.User.Claims
                .FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            var roles = await _userManager.GetRolesAsync(user);
            return Results.Ok(new { id = user.Id, displayName = user.DisplayName, role = roles.FirstOrDefault(), email = user.Email, picture = user.Picture });
        }

        private static async Task<string> IssueRefreshToken(ApplicationUser user)
        {
            var expiration = DateTime.UtcNow.Add(TimeSpan.FromMinutes(_authConfig.RefreshTokenExpirationMinutes));
            string refreshToken = _jwtUtils.GenerateRefreshToken();
            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = DateTime.Now.AddMinutes(_authConfig.RefreshTokenExpirationMinutes);

            await _userManager.UpdateAsync(user);

            return refreshToken;
        }

        private static async Task<string> IssueAccessToken(ApplicationUser user)
        {
            var validUntil = DateTime.UtcNow.Add(TimeSpan.FromMinutes(_authConfig.AccessTokenExpirationMinutes));

            var userRoles = await _userManager.GetRolesAsync(user);

            var authClaims = new List<Claim>
                {
                    new Claim("picture", user.Picture),
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Name, user.DisplayName),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                };

            foreach (var userRole in userRoles)
            {
                authClaims.Add(new Claim(ClaimTypes.Role, userRole));
            }

            var accessToken = _jwtUtils.GenerateToken(authClaims, validUntil);

            return accessToken;
        }

        private static async Task<ClaimsPrincipal> CreateClaimsPrincipalFromUser(ApplicationUser user)
        {
            var identity = new ClaimsIdentity(CookieAuthenticationDefaults.AuthenticationScheme);
            var roles = await _userManager.GetRolesAsync(user);
            identity.AddClaim(new Claim(ClaimTypes.NameIdentifier, user.Id));
            foreach (var role in roles)
            {
                identity.AddClaim(new Claim(ClaimTypes.Role, role));
            }

            return new ClaimsPrincipal(identity);
        }
    }
}