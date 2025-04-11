namespace BuildAbot.Services
{
    public class CommentService : ICommentService
    {
        private readonly ICommentRepository _commentRepository;


        public CommentService(ICommentRepository commentRepository)
        {
            _commentRepository = commentRepository;
        }

        public static CommentResponse MapCommentToCommentResponse(Comment comment)
        {
            CommentResponse response = new CommentResponse
            {
                Id = comment.Id,
                PostId = comment.PostId,
                Text = comment.Text,
                CreatedAt = comment.CreatedAt,
                ParentCommentId = comment.ParentCommentId,
                User = new UserCommentResponse
                {
                    Id = comment.User.Id,
                    UserName = comment.User.UserName,
                    Email = comment.User.Email
                },

            };
            

            return response;
        }

        private static Comment MapCommentRequestTComment(CommentRequest commentRequest)
        {
            Comment comment = new Comment
            {
                PostId = commentRequest.PostId,
                UserId = commentRequest.UserId,
                Text = commentRequest.Text,
                CreatedAt = DateTime.UtcNow,
                ParentCommentId = commentRequest.ParentCommentId,
            };
            return comment;
        }

        public async Task<List<CommentResponse>> GetAllAsync()
        {
            List<Comment> comments = await _commentRepository.GetAllAsync();

            if (comments == null)
            {
                throw new ArgumentException();
            }
            return comments.Select(MapCommentToCommentResponse).ToList();
        }

        public async Task<CommentResponse> FindByIdAsync(int commentId)
        {
            var comment = await _commentRepository.FindByIdAsync(commentId);

            if (comment != null)
            {
                return MapCommentToCommentResponse(comment);
            }

            return null;
        }
    }
}
