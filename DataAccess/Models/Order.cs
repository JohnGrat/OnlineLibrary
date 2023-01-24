using System;
using System.Collections.Generic;

namespace DataAccess.Models;

public partial class Order
{
    public int StoreId { get; set; }

    public int Id { get; set; }

    public int CustomerId { get; set; }

    public DateTime? ShippingDate { get; set; }

    public DateTime? OrderDate { get; set; }

    public virtual ICollection<BookOrder> BookOrders { get; } = new List<BookOrder>();

    public virtual Customer Customer { get; set; } = null!;

    public virtual Store Store { get; set; } = null!;
}
