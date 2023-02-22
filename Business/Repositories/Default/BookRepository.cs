using Microsoft.EntityFrameworkCore;
using AutoMapper;
using DataAccess.Models;
using DataAccess.Data;
using Azure;
using Business.Dtos.Books;

namespace Business.Repositories.Default
{
    public class BookRepository : IRepository<BookDto, BookBriefDto>
    {
        private readonly BookstoreContext _context;
        private readonly IMapper _mapper;
        
        public BookRepository(BookstoreContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public Task<BookDto> AddAsync(BookDto entity)
        {
            throw new NotImplementedException();
        }

        public Task<BookDto> DeleteAsync(object id)
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<BookBriefDto>> GetAllAsync(string sort, string filter, int? page, int? pageSize)
        {
            var query = _context.Books
                .Include(b => b.Language)
                .Include(b => b.Authors)
                .Include(b => b.Publisher)
                .AsQueryable();

            // Apply filter
            if (!string.IsNullOrEmpty(filter))
            {
                query = query.Where(b => b.Title.Contains(filter) || b.Authors.Any(a => a.AuthorName.Contains(filter)));
            }

            // Apply sorting
            if (!string.IsNullOrEmpty(sort))
            {
                switch (sort)
                {
                    case "title_asc":
                        query = query.OrderBy(b => b.Title);
                        break;
                    case "title_desc":
                        query = query.OrderByDescending(b => b.Title);
                        break;
                    default:
                        break;
                }
            }

            // Apply pagination
            if (page != null && pageSize != null)
            {
                query = query.Skip((page.Value - 1) * pageSize.Value).Take(pageSize.Value);
            }

            var books = await query.ToListAsync();

            var booksDto = _mapper.Map<List<BookBriefDto>>(books);

            return booksDto;
        }

        public async Task<BookDto> GetByIdAsync(object id)
        {
            var model = await _context.Books
                .Where(b => b.BookId == id)
                .Include(b => b.Language)
                .Include(b => b.Authors)
                .Include(b => b.Publisher)
                .FirstOrDefaultAsync();

            if (model == null)
            {
                throw new ArgumentException($"book with isbn '{id}' does not exist.");
            }

            var bookDto = _mapper.Map<BookDto>(model);

            return bookDto;
        }

        public Task<BookDto> UpdateAsync(BookDto entity)
        {
            throw new NotImplementedException();
        }
    }
}
