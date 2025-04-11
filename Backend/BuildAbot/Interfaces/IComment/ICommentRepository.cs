namespace BuildAbot.Interfaces.IComment
{
    public interface ICommentRepository
    {
        Task<List<Comment>> GetAllAsync();
        Task<Comment?> FindByIdAsync(int commentId);
    }
}
