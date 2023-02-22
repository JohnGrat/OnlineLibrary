using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace WestCoastEducation.Config
{
    public class JwtConfig
    {

        public string? GoogleClientId { get; set; }

        public string? Secret { get; set; }

        public string? Issuer { get; set; }

        public string? Audience { get; set; }

        public int AccessTokenExpirationMinutes { get; set; }

        public int RefreshTokenExpirationMinutes { get; set; }

        public SymmetricSecurityKey SigningKey
        {
            get
            {
                if (Secret is null)
                {
                    throw new System.Exception($"Can not generate a signing key because secret is not set. Make sure {nameof(Secret)} is set for {nameof(JwtConfig)}.");
                }

                return new SymmetricSecurityKey(Encoding.ASCII.GetBytes(Secret));
            }
        }
    }
}
