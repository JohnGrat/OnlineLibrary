namespace DataAccess.Models;

public partial class BookLanguage
{
    public int Id { get; set; }

    public string? LanguageCode { get; set; }

    public string? LanguageName { get; set; }

    public virtual ICollection<Book> Books { get; } = new List<Book>();
}