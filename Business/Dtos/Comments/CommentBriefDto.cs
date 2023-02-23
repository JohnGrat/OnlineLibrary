using Google.Cloud.Firestore;

namespace Business.Dtos.Comments;

[FirestoreData]
public class CommentBriefDto
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