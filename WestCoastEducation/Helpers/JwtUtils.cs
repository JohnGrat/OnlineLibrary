using DataAccess.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace WestCoastEducation.Helpers
{

    public interface IJwtUtils
    {
        public ClaimsPrincipal? GetPrincipalFromExpiredToken(string? token);
        public string GenerateRefreshToken();
        public JwtSecurityToken CreateToken(List<Claim> authClaims);
        public bool TryExtractClientCredentials(string authHeader, out string username, out string password);
    }

    public class JwtUtils : IJwtUtils
    {

        private readonly IConfiguration _configuration;


        public JwtUtils(IConfiguration configuration)
        {
           _configuration = configuration;
        }

        public string GenerateRefreshToken()
        {
            var randomNumber = new byte[64];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }

        public ClaimsPrincipal? GetPrincipalFromExpiredToken(string? token)
        {
            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateAudience = false,
                ValidateIssuer = false,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"])),
                ValidateLifetime = false
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out SecurityToken securityToken);
            if (securityToken is not JwtSecurityToken jwtSecurityToken || !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
                throw new SecurityTokenException("Invalid token");

            return principal;

        }

        public JwtSecurityToken CreateToken(List<Claim> authClaims)
        {
  
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]));
            _ = int.TryParse(_configuration["JWT:TokenValidityInMinutes"], out int tokenValidityInMinutes);

            var token = new JwtSecurityToken(
                issuer: _configuration["JWT:ValidIssuer"],
                audience: _configuration["JWT:ValidAudience"],
                expires: DateTime.Now.AddMinutes(tokenValidityInMinutes),
                claims: authClaims,
                signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
                );

            return token;
        }

        public bool TryExtractClientCredentials(string authHeader, out string username, out string password)
        {
            username = null;
            password = null;

            // Check if the header value starts with "Basic"
            if (!authHeader.StartsWith("Basic"))
            {
                return false;
            }

            // Decode the Base64 encoded value
            var encodedValue = authHeader.Substring("Basic ".Length).Trim();
            var decodedValue = Encoding.UTF8.GetString(Convert.FromBase64String(encodedValue));

            // Split the decoded value into client ID and client secret
            var parts = decodedValue.Split(':');
            if (parts.Length != 2)
            {
                return false;
            }

            username = parts[0];
            password = parts[1];
            return true;
        }

    }
}
