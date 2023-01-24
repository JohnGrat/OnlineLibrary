using System;
using System.Collections.Generic;

namespace DataAccess.Models;

public partial class Author
{
    public int Id { get; set; }

    public DateTime? AuthorBirthday { get; set; }

    public string? AuthorEmail { get; set; }

    public string? AuthorPhoneNumber { get; set; }

    public string? AuthorName { get; set; }

    public virtual ICollection<Book> Books { get; } = new List<Book>();
}
