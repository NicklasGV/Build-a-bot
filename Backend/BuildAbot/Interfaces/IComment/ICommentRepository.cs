namespace BuildAbot.Interfaces.IComment
{
    public interface ICommentRepository
    {
        Task<List<Comment>> GetAllAsync();
        Task<Comment?> FindByIdAsync(int commentId);
        Task<Comment> CreateAsync(Comment newComment);
        Task<Comment> UpdateByIdAsync(int commentId, Comment updateComment);
        Task<Comment?> DeleteByIdAsync(int commentId);
    }
}
