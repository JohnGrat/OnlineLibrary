using Business.Dtos.Books;
using Business.Repositories;
using WestCoastEducation.Helpers;

namespace WestCoastEducation.Endpoints
{
    public static class BookEndpoint
    {
        private static readonly IRepository<BookDto, BookBriefDto> _bookService;

        static BookEndpoint()
        {
            _bookService = ServiceLocator.GetService<IRepository<BookDto, BookBriefDto>>();
        }

        public static WebApplication MapBookEndpoints(this WebApplication app)
        {
            app.MapGet("/api/book", GetAllBooks).WithTags("Books");
            app.MapGet("/api/book/{id}", GetOneBook).WithTags("Books");
            return app;
        }

        private static async Task<IResult> GetOneBook(string id)
        {
            var model = await _bookService.GetByIdAsync(id);

            if (model == null)
            {
                return Results.BadRequest("Not Found");
            }

            return Results.Ok(model);
        }

        private static async Task<IResult> GetAllBooks(string? sort, string? filter, int? page = 1, int? pageSize = 100)
        {
            var models = await _bookService.GetAllAsync(sort, filter, page, pageSize);

            return Results.Ok(models);
        }
    }
}