namespace Business.Dtos.Books
{
    public class BookBriefDto
    {
        public string BookId { get; set; } = null!;

        public string Title { get; set; } = null!;

        public string? AuthorsName { get; set; }

        public DateTime? PublicationDate { get; set; }

        public string? LanguageName { get; set; }

        public decimal BookPrice { get; set; }
    }
}