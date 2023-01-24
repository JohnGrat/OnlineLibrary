using System;
using System.Collections.Generic;

namespace DataAccess.Models;

public partial class Customer
{
    public int Id { get; set; }

    public string? CustomerFirstname { get; set; }

    public string? CustomerLastname { get; set; }

    public int? AddressId { get; set; }

    public string? CustomerEmail { get; set; }

    public string? CustomerPhoneNumber { get; set; }

    public virtual Address? Address { get; set; }

    public virtual ICollection<Order> Orders { get; } = new List<Order>();
}
