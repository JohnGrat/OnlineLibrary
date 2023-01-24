using Business.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Business.Services
{
    public interface IBookService
    {
        Task<List<BookBriefDto>> GetAllBooks(string? sort, string? filter, int? page, int? pageSize);
        Task<BookDto> GetBookById(string ISBN);
        Task AddBook(BookDto book);
        Task UpdateBook(BookDto book);
        Task RemoveBook(string ISBN);
    }
}
