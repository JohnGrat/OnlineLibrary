using Azure.Core;

namespace WestCoastEducation.Models.Token;

public class TokensModel
{
    public string AccessToken;

    public string RefreshToken;

    public TokensModel(string accessToken, string refreshToken)
    {
        AccessToken = accessToken;
        RefreshToken = refreshToken;
    }
}
