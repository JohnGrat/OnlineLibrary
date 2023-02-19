using Google.Cloud.Firestore;


namespace Business.Dtos.Comments;

[FirestoreData]
public class CommentDto
{
    [FirestoreProperty]
    public int Id { get; set; }

    [FirestoreProperty]
    public string BookId { get; set; }

    [FirestoreProperty]
    public DateTime PostedAt { get; set; }
    [FirestoreProperty]
    public string Body { get; set; }
    [FirestoreProperty]
    public Author Author { get; set; }
}


[FirestoreData]
public class Author
{
    [FirestoreProperty]
    public string Name { get; set; }

    [FirestoreProperty]
    public string Image { get; set; }
}
