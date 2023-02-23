namespace DataAccess.Models;

public partial class BookOrder
{
    public string BookId { get; set; } = null!;

    public int OrderId { get; set; }

    public int BoQuantity { get; set; }

    public decimal BoPrice { get; set; }

    public virtual Book Book { get; set; } = null!;

    public virtual Order Order { get; set; } = null!;
}