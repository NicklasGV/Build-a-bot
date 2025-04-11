namespace BuildAbot.Interfaces.IComment
{
    public interface ICommentService
    {
        Task<List<CommentResponse>> GetAllAsync();
        Task<CommentResponse?> FindByIdAsync(int commentId);
    }
}
