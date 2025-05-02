namespace BuildAbot.Interfaces.IComment
{
    public interface ICommentService
    {
        Task<List<CommentResponse>> GetAllAsync();
        Task<CommentResponse?> FindByIdAsync(int commentId);
        Task<CommentResponse> CreateAsync(CommentRequest newComment);
        Task<CommentResponse> UpdateByIdAsync(int commentId, CommentRequest updateComment);
        Task<CommentResponse?> DeleteByIdAsync(int commentId);
        Task<CommentResponse?> SoftDeleteByIdAsync(int commentId);
    }
}
