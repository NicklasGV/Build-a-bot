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

        private static Comment MapCommentRequestComment(CommentRequest commentRequest)
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

        public async Task<CommentResponse> CreateAsync(CommentRequest commentRequest)
        {
            Comment newComment = MapCommentRequestComment(commentRequest);
            newComment = await _commentRepository.CreateAsync(newComment);
            return MapCommentToCommentResponse(newComment);
        }

        public async Task<CommentResponse> UpdateByIdAsync(int commentId, CommentRequest commentRequest)
        {
            Comment updateComment = MapCommentRequestComment(commentRequest);
            Comment comment = await _commentRepository.UpdateByIdAsync(commentId, updateComment);
            return MapCommentToCommentResponse(comment);
        }

        public async Task<CommentResponse> DeleteByIdAsync(int commentId)
        {
            var comment = await _commentRepository.DeleteByIdAsync(commentId);
            return MapCommentToCommentResponse(comment);
        }

        public async Task<CommentResponse> SoftDeleteByIdAsync(int commentId)
        {
            var comment = await _commentRepository.FindByIdAsync(commentId);
            comment.IsDeleted = true;
            comment = await _commentRepository.UpdateByIdAsync(commentId, comment);
            return MapCommentToCommentResponse(comment);
        }
    }
}
