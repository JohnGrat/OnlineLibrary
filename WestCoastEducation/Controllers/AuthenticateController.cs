using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using WestCoastEducation.Config;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using WestCoastEducation.Auth;
using WestCoastEducation.Helpers;

namespace WestCoastEducation.Controllers
{
    [ApiController]
    [Route("api/authenticate")]
    public class AuthenticateController : ControllerBase
    {

        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IJwtUtils _jwtUtils;
        private readonly JwtConfig _config;

        public AuthenticateController(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager, IJwtUtils jwtUtils, JwtConfig config)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _jwtUtils = jwtUtils;
            _config = config;
        }

        [Authorize(Roles = UserRoles.Admin)]
        [HttpPost]
        [Route("register-admin")]
        public async Task<IActionResult> RegisterAdmin([FromBody] RegisterModel model)
        {
            var userExists = await _userManager.FindByNameAsync(model.Username);
            if (userExists != null)
                return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Error", Message = "User already exists!" });

            ApplicationUser user = new()
            {
                Email = model.Email,
                SecurityStamp = Guid.NewGuid().ToString(),
                UserName = model.Username
            };
            var result = await _userManager.CreateAsync(user, model.Password);
            if (!result.Succeeded)
                return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Error", Message = "User creation failed! Please check user details and try again." });

            if (!await _roleManager.RoleExistsAsync(UserRoles.Admin))
            {
                await _roleManager.CreateAsync(new IdentityRole(UserRoles.Admin));
            }
        
            if (await _roleManager.RoleExistsAsync(UserRoles.Admin))
            {
                await _userManager.AddToRoleAsync(user, UserRoles.Admin);
            }

            return Ok(new Response { Status = "Success", Message = "User created successfully!" });
        }

        [HttpGet]
        [Route("GoogleExternalLogin")]
        public async Task<IActionResult> GoogleExternalLogin()
        {

            var accessToken = Request.Headers["Authorization"].ToString().Split(" ")[1];

            var payload = await _jwtUtils.VerifyGoogleToken(accessToken);
            if (payload == null)
            {
                return Unauthorized();
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
                        return Unauthorized();
                    }
                }
                var resultLOgin = await _userManager.AddLoginAsync(user, info);
                if (!resultLOgin.Succeeded)
                {
                    return Unauthorized();
                }
            }

            user.Picture = payload.Picture;
            user.DisplayName = payload.Name;
            await _userManager.UpdateAsync(user);
 
            string newAccessToken = IssueAccessToken(user).Result;
            string refreshToken = IssueRefreshToken(user).Result;

            return Ok(new
            {
                accessToken = newAccessToken,
                refreshToken = refreshToken,
            });
        }

        [HttpGet]
        [Route("authorize")]
        public async Task<IActionResult> Login()
        {

            if (!Request.Headers.TryGetValue("Authorization", out var authHeader)
                || !_jwtUtils.TryExtractClientCredentials(authHeader, out string username, out string password))
            {
                return Unauthorized();
            }

            var user = await _userManager.FindByNameAsync(username);

            if (user != null && await _userManager.CheckPasswordAsync(user, password))
            {

                string newAccessToken = IssueAccessToken(user).Result;
                string refreshToken = IssueRefreshToken(user).Result;

                return Ok(new
                {
                    accessToken = newAccessToken,
                    refreshToken = refreshToken,
                });
            }

            return Unauthorized();
        }

        [HttpPost]
        [Route("refresh-token")]
        public async Task<IActionResult> RefreshToken(TokenModel tokenModel)
        {
        
            if (tokenModel is null)
            {
                return BadRequest("Invalid client request");
            }

            string? refreshToken = tokenModel.RefreshToken;

            var user = await _userManager.Users.FirstOrDefaultAsync(u => u.RefreshToken == refreshToken);

            if (user == null || user.RefreshToken != refreshToken || user.RefreshTokenExpiryTime <= DateTime.Now)
            {
                return BadRequest("Invalid access token or refresh token");
            }

            string newAccessToken = IssueAccessToken(user).Result;
            string newRefreshToken = IssueRefreshToken(user).Result;

            user.RefreshToken = newRefreshToken;
            await _userManager.UpdateAsync(user);

            return Ok(new
            {
                accessToken = newAccessToken,
                refreshToken = newRefreshToken,
            });
        }


        [Authorize(Roles = UserRoles.Admin)]
        [HttpPost]
        [Route("revoke/{username}")]
        public async Task<IActionResult> Revoke(string username)
        {

            var user = await _userManager.FindByNameAsync(username);
            if (user == null) return BadRequest("Invalid user name");

            user.RefreshToken = null;
            await _userManager.UpdateAsync(user);

            return NoContent();
        }

        [Authorize(Roles = UserRoles.Admin)]
        [HttpPost]
        [Route("revoke-all")]
        public async Task<IActionResult> RevokeAll()
        {
            var users = _userManager.Users.ToList();
            foreach (var user in users)
            {
                user.RefreshToken = null;
                await _userManager.UpdateAsync(user);
            }

            return NoContent();
        }

        [HttpGet]
        [Route("me")]
        [Authorize]
        public async Task<IActionResult> GetCurrentUser()
        {
            var user = await _userManager.FindByIdAsync(User.Claims
                .FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            var roles = await _userManager.GetRolesAsync(user);
            return Ok(new { username = user.UserName, roles = roles.ToArray(), email = user.Email, id = user.Id });
        }


        private async Task<string> IssueRefreshToken(ApplicationUser user)
        {
            var expiration = DateTime.UtcNow.Add(TimeSpan.FromMinutes(_config.RefreshTokenExpirationMinutes));
            string refreshToken = _jwtUtils.GenerateRefreshToken();
            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = DateTime.Now.AddMinutes(_config.RefreshTokenExpirationMinutes);

            await _userManager.UpdateAsync(user);

            return refreshToken;

        }

        private async Task<string> IssueAccessToken(ApplicationUser user)
        {
            var validUntil = DateTime.UtcNow.Add(TimeSpan.FromMinutes(_config.AccessTokenExpirationMinutes));

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

    }
}
