namespace DataAccess.Models;

public partial class Address
{
    public int Id { get; set; }

    public string? StreetNumber { get; set; }

    public string? StreetName { get; set; }

    public string? City { get; set; }

    public string? Country { get; set; }

    public virtual ICollection<Customer> Customers { get; } = new List<Customer>();

    public virtual ICollection<Store> Stores { get; } = new List<Store>();
}