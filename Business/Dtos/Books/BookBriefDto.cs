using DataAccess.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Business.Dtos.Books
{
    public class BookBriefDto
    {
        public string Id { get; set; } = null!;

        public string Title { get; set; } = null!;

        public string? AuthorsName { get; set; }

        public DateTime? PublicationDate { get; set; }

        public string? LanguageName { get; set; }

        public decimal BookPrice { get; set; }

    }
}
