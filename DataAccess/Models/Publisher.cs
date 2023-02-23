using System.Text.Json.Serialization;

namespace DataAccess.Models;

public partial class Publisher
{
    public int Id { get; set; }

    public string? PublisherName { get; set; }

    [JsonIgnore]
    public virtual ICollection<Book> Books { get; } = new List<Book>();
}