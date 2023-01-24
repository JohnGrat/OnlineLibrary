using System;
using System.Collections.Generic;

namespace DataAccess.Models;

public partial class NumberOfBookSoldPerMonth
{
    public string? MonthOfYear { get; set; }

    public int? TotalAmountOfBooksSold { get; set; }
}
