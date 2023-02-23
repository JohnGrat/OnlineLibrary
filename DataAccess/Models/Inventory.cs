namespace DataAccess.Models;

public partial class Inventory
{
    public string BookId { get; set; } = null!;

    public int StoreId { get; set; }

    public int InvQuantity { get; set; }

    public virtual Book Book { get; set; } = null!;

    public virtual Store Store { get; set; } = null!;
}