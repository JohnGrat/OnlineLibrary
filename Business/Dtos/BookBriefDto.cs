using DataAccess.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Business.Dtos
{
    public class BookBriefDto
    {
        public string Id { get; set; } = null!;

        public string Title { get; set; } = null!;

        public int? NumPages { get; set; }

        public decimal BookPrice { get; set; }

        public string? LanguageName { get; set; }

        public string? AuthorsName { get; set; }

    }
}
