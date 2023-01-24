using System;
using System.Collections.Generic;

namespace DataAccess.Models;

public partial class SalesPerCustomer
{
    public int Id { get; set; }

    public string? Firstname { get; set; }

    public string? Lastname { get; set; }

    public string? Email { get; set; }

    public decimal? TotaltAmountSpentThisYear { get; set; }
}
