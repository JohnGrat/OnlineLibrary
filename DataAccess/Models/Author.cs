using System.Text.Json.Serialization;

namespace DataAccess.Models;

public partial class Author
{
    public int Id { get; set; }

    public DateTime? AuthorBirthday { get; set; }

    public string? AuthorEmail { get; set; }

    public string? AuthorPhoneNumber { get; set; }

    public string? AuthorName { get; set; }

    [JsonIgnore]
    public virtual ICollection<Book> Books { get; } = new List<Book>();
}