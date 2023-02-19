using Google.Cloud.Firestore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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

