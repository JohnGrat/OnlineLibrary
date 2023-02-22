using Microsoft.EntityFrameworkCore.Infrastructure;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DataAccess.Models;

public partial class Book
{
    public string BookId { get; set; }

    public string Title { get; set; } = null!;

    public int LanguageId { get; set; }

    public int? NumPages { get; set; }

    public DateTime? PublicationDate { get; set; }

    public int? PublisherId { get; set; }

    public decimal BookPrice { get; set; }

    public virtual ICollection<BookOrder> BookOrders { get; } = new List<BookOrder>();

    public virtual ICollection<Inventory> Inventories { get; } = new List<Inventory>();

    public virtual BookLanguage Language { get; set; } = null!;

    public virtual Publisher? Publisher { get; set; }

    public virtual ICollection<Author> Authors { get; } = new List<Author>();
}
