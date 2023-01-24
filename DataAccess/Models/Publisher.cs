using System;
using System.Collections.Generic;

namespace DataAccess.Models;

public partial class Publisher
{
    public int Id { get; set; }

    public string? PublisherName { get; set; }

    public virtual ICollection<Book> Books { get; } = new List<Book>();
}
