using Microsoft.AspNetCore.Identity;

namespace WestCoastEducation.Auth
{
    public class ApplicationUser : IdentityUser
    {
        public string? DisplayName { get; set; }
        public string? Picture { get; set; }
        public string? RefreshToken { get; set; }
        public DateTime RefreshTokenExpiryTime { get; set; }
    }
}