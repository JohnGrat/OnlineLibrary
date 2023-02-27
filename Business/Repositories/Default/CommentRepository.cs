using Business.Dtos.Comments;
using Google.Cloud.Firestore;
using Microsoft.Extensions.Caching.Memory;

namespace Business.Repositories.Default;

public class CommentRepository : IRepository<CommentDto, CommentBriefDto>
{
    private readonly CollectionReference _commentCollection;
    private readonly IMemoryCache _memoryCache;
    private readonly TimeSpan _cacheDuration = TimeSpan.FromMinutes(10);

    public CommentRepository(FirestoreDb context, IMemoryCache memoryCache)
    {
        _commentCollection = context.Collection("comments");
        _memoryCache = memoryCache;
    }

    public async Task<IEnumerable<CommentBriefDto>> GetAllAsync(string? sort, string? filter, int? page, int? pageSize)
    {
        var cacheKey = $"{nameof(CommentRepository)}_{filter}_{page}_{pageSize}";
        if (_memoryCache.TryGetValue(cacheKey, out IEnumerable<CommentBriefDto> cachedComments))
        {
            return cachedComments;
        }
        // Create a query with the specified filter
        var data = await _commentCollection.GetSnapshotAsync();
        var comments = data.Documents.Select(doc => doc.ConvertTo<CommentBriefDto>());
        var bookComments = comments.Where(r => r.BookId == filter);
        _memoryCache.Set(cacheKey, bookComments, _cacheDuration);

        return bookComments;
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
                }
            });

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