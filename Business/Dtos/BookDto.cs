using DataAccess.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Business.Dtos
{
    public class BookDto
    {
        public string Id { get; set; } = null!;

        public string Title { get; set; } = null!;

        public int? NumPages { get; set; }

        public DateTime? PublicationDate { get; set; }

        public decimal BookPrice { get; set; }

        public int LanguageId { get; set; }

        public int? PublisherId { get; set; }

        public virtual BookLanguage Language { get; set; } = null!;

        public virtual Publisher? Publisher { get; set; }

        public virtual ICollection<Author> Authors { get; } = new List<Author>();
    }
}
