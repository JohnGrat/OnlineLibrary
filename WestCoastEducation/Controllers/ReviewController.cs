using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WestCoastEducation.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/review")]
    public class ReviewController : ControllerBase
    {
    }
}
