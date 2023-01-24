using Azure.Core;
using Business.Dtos;
using Business.Services;
using IdentityModel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace WestCoastEducation.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/book")]
    public class BookController : ControllerBase
    {

        private readonly IBookService _bookService;

        public BookController(ILogger<BookController> logger, IBookService bookService)
        {
            _bookService = bookService;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> GetAsync(string id)
        {

            var model = await _bookService.GetBookById(id);

            if (model == null)
            {
                return NotFound();
            }

            return Ok(model);
        }

        [HttpGet]
        public async Task<ActionResult> GetAllBooks(string? sort, string? filter, int? page, int? pageSize)
        {
            var models = await _bookService.GetAllBooks(sort, filter, page, pageSize);

            return Ok(models);
        }
    }
}