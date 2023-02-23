using DataAccess.Models;

namespace Business.Dtos.Books
{
    public class BookDto
    {
        public string BookId { get; set; } = null!;

        public string Title { get; set; } = null!;

        public int? NumPages { get; set; }

        public DateTime? PublicationDate { get; set; }

        public decimal BookPrice { get; set; }

        public string? LanguageName { get; set; }

        public virtual Publisher? Publisher { get; set; }

        public virtual ICollection<Author> Authors { get; } = new List<Author>();
    }
}