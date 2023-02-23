using Google.Apis.Auth;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using WestCoastEducation.Config;

namespace WestCoastEducation.Helpers
{
    public interface IJwtUtils
    {
        //public ClaimsPrincipal? GetPrincipalFromExpiredToken(string? token);
        public string GenerateRefreshToken();

        public string GenerateToken(IEnumerable<Claim> claims, DateTime expires);

        public bool TryExtractClientCredentials(string authHeader, out string username, out string password);

        Task<GoogleJsonWebSignature.Payload> VerifyGoogleToken(string token);
    }

    public class JwtUtils : IJwtUtils
    {
        private readonly JwtConfig _config;

        public JwtUtils(JwtConfig config)
        {
            _config = config ?? throw new ArgumentNullException(nameof(config));
        }

        public string GenerateToken(IEnumerable<Claim> claims, DateTime expires)
        {
            var signingCredentials = new SigningCredentials(_config.SigningKey, SecurityAlgorithms.HmacSha256);
            var jwt = new JwtSecurityToken(
                issuer: _config.Issuer,
                audience: _config.Audience,
                claims,
                DateTime.UtcNow,
                expires,
                signingCredentials);

            return new JwtSecurityTokenHandler().WriteToken(jwt);
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

        public async Task<GoogleJsonWebSignature.Payload> VerifyGoogleToken(string token)
        {
            string clientID = _config.GoogleClientId ?? "";
            var settings = new GoogleJsonWebSignature.ValidationSettings()
            {
                Audience = new List<string>() { clientID }
            };

            var payload = await GoogleJsonWebSignature.ValidateAsync(token, settings);
            return payload;
        }

        public string GenerateRefreshToken()
        {
            var randomNumber = new byte[64];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }
    }
}