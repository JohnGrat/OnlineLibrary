using Business.Dtos.Comments;
using Google.Cloud.Firestore;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;

namespace Business.Repositories.Default;

public class CommentRepository : IRepository<CommentDto, CommentBriefDto>
{
    
    private readonly CollectionReference _commentCollection;

    public CommentRepository(FirestoreDb context)
    {
        _commentCollection = context.Collection("comments");
    }

    public async Task<IEnumerable<CommentBriefDto>> GetAllAsync(string? sort, string? filter, int? page, int? pageSize)
    {
        // Create a query with the specified filter
        var data = await _commentCollection.GetSnapshotAsync();
        var comments = data.Documents.Select(doc => doc.ConvertTo<CommentBriefDto>());
        return comments.Where(r => r.BookId == filter);
    }

    public async Task<CommentDto> AddAsync(CommentDto entity)
    {
        // Find the highest ID for the given book ID
        var highestId = await _commentCollection.WhereEqualTo(nameof(CommentDto.BookId), entity.BookId)
            .OrderByDescending(nameof(CommentDto.Id))
            .Limit(1)
            .Select(nameof(CommentDto.Id))
            .GetSnapshotAsync()
            .ContinueWith(snapshot =>
            {                   
            var highestIdDocument = snapshot.Result.Documents.FirstOrDefault();
            if (highestIdDocument == null)
            {
            return 0;
            }
            else
            {
            return highestIdDocument.ConvertTo<CommentDto>().Id;
            }});

        // Generate a new ID by adding 1 to the highest ID
        entity.Id = highestId + 1;

        var document = await _commentCollection.AddAsync(entity);
        return entity;
    }

    Task<CommentDto> IRepository<CommentDto, CommentBriefDto>.DeleteAsync(object id)
    {
        throw new NotImplementedException();
    }

    Task<CommentDto> IRepository<CommentDto, CommentBriefDto>.GetByIdAsync(object id)
    {
        throw new NotImplementedException();
    }

    Task<CommentDto> IRepository<CommentDto, CommentBriefDto>.UpdateAsync(CommentDto entity)
    {
        throw new NotImplementedException();
    }
}
