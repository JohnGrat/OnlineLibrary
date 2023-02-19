using Azure.Core;
using Business.Dtos.Books;
using Business.Repositories;
using IdentityModel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace WestCoastEducation.Controllers
{
    [ApiController]
    [Route("api/book")]
    public class BookController : ControllerBase
    {

        private readonly IRepository<BookDto, BookBriefDto> _bookService;

        public BookController(ILogger<BookController> logger, IRepository<BookDto, BookBriefDto> bookService)
        {
            _bookService = bookService;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> GetAsync(string id)
        {

            var model = await _bookService.GetByIdAsync(id);

            if (model == null)
            {
                return NotFound();
            }

            return Ok(model);
        }

        [HttpGet]
        public async Task<ActionResult> GetAllBooks(string? sort, string? filter, int? page = 1, int? pageSize = 100)
        {
            var models = await _bookService.GetAllAsync(sort, filter, page, pageSize);

            return Ok(models);
        }
    }
}