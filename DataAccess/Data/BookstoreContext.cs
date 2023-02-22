using DataAccess.Models;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Data;

public partial class BookstoreContext : DbContext
{
    public BookstoreContext()
    {
    }

    public BookstoreContext(DbContextOptions<BookstoreContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Address> Addresses { get; set; }

    public virtual DbSet<Author> Authors { get; set; }

    public virtual DbSet<Book> Books { get; set; }

    public virtual DbSet<BookLanguage> BookLanguages { get; set; }

    public virtual DbSet<BookOrder> BookOrders { get; set; }

    public virtual DbSet<BooksPerAuthorInInventory> BooksPerAuthorInInventories { get; set; }

    public virtual DbSet<Customer> Customers { get; set; }

    public virtual DbSet<Inventory> Inventories { get; set; }

    public virtual DbSet<NumberOfBookSoldPerMonth> NumberOfBookSoldPerMonths { get; set; }

    public virtual DbSet<Order> Orders { get; set; }

    public virtual DbSet<Publisher> Publishers { get; set; }

    public virtual DbSet<SalesPerCustomer> SalesPerCustomers { get; set; }

    public virtual DbSet<Store> Stores { get; set; }


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Address>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("pk_address");

            entity.ToTable("address");

            entity.Property(e => e.Id).HasColumnName("address_id");
            entity.Property(e => e.City)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("city");
            entity.Property(e => e.Country)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("country");
            entity.Property(e => e.StreetName)
                .HasMaxLength(200)
                .IsUnicode(false)
                .HasColumnName("street_name");
            entity.Property(e => e.StreetNumber)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("street_number");
        });

        modelBuilder.Entity<Author>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("pk_author");

            entity.ToTable("author");

            entity.Property(e => e.Id).HasColumnName("author_id");
            entity.Property(e => e.AuthorBirthday)
                .HasColumnType("date")
                .HasColumnName("author_birthday");
            entity.Property(e => e.AuthorEmail)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("author_email");
            entity.Property(e => e.AuthorName)
                .HasMaxLength(255)
                .HasColumnName("author_name");
            entity.Property(e => e.AuthorPhoneNumber)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("author_phone_number");
        });

        modelBuilder.Entity<Book>(entity =>
        {
            entity.HasKey(e => e.BookId).HasName("pk_book");

            entity.ToTable("book");

            entity.Property(e => e.BookId)
                .HasMaxLength(13)
                .IsUnicode(false)
                .HasColumnName("book_id");
            entity.Property(e => e.BookPrice)
                .HasColumnType("decimal(5, 2)")
                .HasColumnName("book_price");
            entity.Property(e => e.LanguageId).HasColumnName("language_id");
            entity.Property(e => e.NumPages).HasColumnName("num_pages");
            entity.Property(e => e.PublicationDate)
                .HasColumnType("date")
                .HasColumnName("publication_date");
            entity.Property(e => e.PublisherId).HasColumnName("publisher_id");
            entity.Property(e => e.Title)
                .HasMaxLength(400)
                .IsUnicode(false)
                .HasColumnName("title");

            entity.HasOne(d => d.Language).WithMany(p => p.Books)
                .HasForeignKey(d => d.LanguageId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_book_bl");

            entity.HasOne(d => d.Publisher).WithMany(p => p.Books)
                .HasForeignKey(d => d.PublisherId)
                .HasConstraintName("fk_book_publisher");

            entity.HasMany(d => d.Authors).WithMany(p => p.Books)
            .UsingEntity<Dictionary<string, object>>(
                "book_author",
                r => r.HasOne<Author>().WithMany()
                    .HasForeignKey("author_id")
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_ba_author"),
                l => l.HasOne<Book>().WithMany()
                    .HasForeignKey("book_id")
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_ba_book"),
                j =>
                {
                    j.HasKey("book_id", "author_id").HasName("pk_bookauthor");
                    j.ToTable("book_author");
                });
        });

        modelBuilder.Entity<BookLanguage>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("pk_language2");

            entity.ToTable("book_language");

            entity.Property(e => e.Id).HasColumnName("language_id");
            entity.Property(e => e.LanguageCode)
                .HasMaxLength(8)
                .IsUnicode(false)
                .HasColumnName("language_code");
            entity.Property(e => e.LanguageName)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("language_name");
        });

        modelBuilder.Entity<BookOrder>(entity =>
        {
            entity.HasKey(e => new { e.OrderId, e.BookId }).HasName("pk_bookorder");

            entity.ToTable("book_order");

            entity.Property(e => e.OrderId).HasColumnName("order_id");
            entity.Property(e => e.BookId)
                .HasMaxLength(13)
                .IsUnicode(false)
                .HasColumnName("book_id");
            entity.Property(e => e.BoPrice)
                .HasColumnType("decimal(5, 2)")
                .HasColumnName("bo_price");
            entity.Property(e => e.BoQuantity).HasColumnName("bo_quantity");

            entity.HasOne(d => d.Book).WithMany(p => p.BookOrders)
                .HasForeignKey(d => d.BookId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_bo_book");

            entity.HasOne(d => d.Order).WithMany(p => p.BookOrders)
                .HasForeignKey(d => d.OrderId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_bo_order");
        });

        modelBuilder.Entity<BooksPerAuthorInInventory>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("BooksPerAuthorInInventory");

            entity.Property(e => e.Name)
                .HasMaxLength(801)
                .IsUnicode(false);
            entity.Property(e => e.TotalInventoryValue).HasColumnType("decimal(38, 2)");
        });

        modelBuilder.Entity<Customer>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("pk_customer");

            entity.ToTable("customer");

            entity.Property(e => e.Id).HasColumnName("customer_id");
            entity.Property(e => e.AddressId).HasColumnName("address_id");
            entity.Property(e => e.CustomerEmail)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("customer_email");
            entity.Property(e => e.CustomerFirstname)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("customer_firstname");
            entity.Property(e => e.CustomerLastname)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("customer_lastname");
            entity.Property(e => e.CustomerPhoneNumber)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("customer_phone_number");

            entity.HasOne(d => d.Address).WithMany(p => p.Customers)
                .HasForeignKey(d => d.AddressId)
                .HasConstraintName("fk_customer_address");
        });

        modelBuilder.Entity<Inventory>(entity =>
        {
            entity.HasKey(e => new { e.StoreId, e.BookId }).HasName("pk_inventory");

            entity.ToTable("inventory");

            entity.Property(e => e.StoreId).HasColumnName("store_id");
            entity.Property(e => e.BookId)
                .HasMaxLength(13)
                .IsUnicode(false)
                .HasColumnName("book_id");
            entity.Property(e => e.InvQuantity).HasColumnName("inv_quantity");

            entity.HasOne(d => d.Book).WithMany(p => p.Inventories)
                .HasForeignKey(d => d.BookId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_inventory_book");

            entity.HasOne(d => d.Store).WithMany(p => p.Inventories)
                .HasForeignKey(d => d.StoreId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_inv_store");
        });

        modelBuilder.Entity<NumberOfBookSoldPerMonth>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("NumberOfBookSoldPerMonth");

            entity.Property(e => e.MonthOfYear).HasMaxLength(4000);
        });

        modelBuilder.Entity<Order>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("pk_order");

            entity.ToTable("order");

            entity.Property(e => e.Id).HasColumnName("order_id");
            entity.Property(e => e.CustomerId).HasColumnName("customer_id");
            entity.Property(e => e.OrderDate).HasColumnName("order_date");
            entity.Property(e => e.ShippingDate).HasColumnName("shipping_date");
            entity.Property(e => e.StoreId).HasColumnName("store_id");

            entity.HasOne(d => d.Customer).WithMany(p => p.Orders)
                .HasForeignKey(d => d.CustomerId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_order_customer");

            entity.HasOne(d => d.Store).WithMany(p => p.Orders)
                .HasForeignKey(d => d.StoreId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_order_store");
        });

        modelBuilder.Entity<Publisher>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("pk_publisher");

            entity.ToTable("publisher");

            entity.Property(e => e.Id).HasColumnName("publisher_id");
            entity.Property(e => e.PublisherName)
                .HasMaxLength(400)
                .IsUnicode(false)
                .HasColumnName("publisher_name");
        });

        modelBuilder.Entity<SalesPerCustomer>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("SalesPerCustomer");

            entity.Property(e => e.Email)
                .HasMaxLength(255)
                .IsUnicode(false); 
            entity.Property(e => e.Firstname)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Lastname)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.TotaltAmountSpentThisYear).HasColumnType("decimal(38, 2)");
        });


        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
