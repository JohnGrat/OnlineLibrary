using System;
using System.Collections.Generic;

namespace DataAccess.Models;

public partial class BooksPerAuthorInInventory
{
    public string? Name { get; set; }

    public int? Age { get; set; }

    public int? NumberOfTitles { get; set; }

    public decimal? TotalInventoryValue { get; set; }
}
