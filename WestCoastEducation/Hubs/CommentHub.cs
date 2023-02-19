using Business.Dtos.Comments;
using Business.Repositories;
using Business.Repositories.Default;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;
using WestCoastEducation.Auth;
using WestCoastEducation.Models.Comments;

namespace WestCoastEducation.Hubs
{

    public class CommentHub : Hub
    {
        private readonly IRepository<CommentDto, CommentBriefDto> _commentRepository;
        private readonly UserManager<ApplicationUser> _userManager;

        public CommentHub(IRepository<CommentDto, CommentBriefDto> commentRepository, UserManager<ApplicationUser> userManager)
        {
            _commentRepository = commentRepository;
            _userManager = userManager;
        }

        public async Task<IEnumerable<CommentBriefDto>> GetCommentsForBook(string bookId)
        {
            string filter = $"bookid={bookId}";
            return await _commentRepository.GetAllAsync(null, bookId, null, null);
        }

        public async Task SubscribeToComments(string bookId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, bookId);
        }

        public async Task UnsubscribeFromComments(string bookId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, bookId);
        }

        [Authorize]
        public async Task NewCommentAdded(CreateCommentModel model)
        {
            var user = await _userManager.FindByIdAsync(Context.User.Claims
                .FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);

            CommentDto comment = new() { 
                BookId = model.BookId,
                Body = model.Body,
                PostedAt = DateTime.UtcNow,
                Author = new Author()
                {
                    Name = user.DisplayName,
                    Image = user.Picture
                }
               
            };

            await _commentRepository.AddAsync(comment);
            await Clients.Group(comment.BookId).SendAsync("CommentAdded", comment);
        }
    }
}
