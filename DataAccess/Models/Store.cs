using System;
using System.Collections.Generic;

namespace DataAccess.Models;

public partial class Store
{
    public int Id { get; set; }

    public string? StoreName { get; set; }

    public string? StoreWebsite { get; set; }

    public int AddressId { get; set; }

    public virtual Address Address { get; set; } = null!;

    public virtual ICollection<Inventory> Inventories { get; } = new List<Inventory>();

    public virtual ICollection<Order> Orders { get; } = new List<Order>();
}
