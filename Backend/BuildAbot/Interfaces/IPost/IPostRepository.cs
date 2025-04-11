namespace BuildAbot.Interfaces.IPost
{
    public interface IPostRepository
    {
        Task<List<Post>> GetAllAsync();
        Task<Post?> FindByIdAsync(int postId);
        //Task<Post> CreateAsync(Post newPost);
        //Task<Post> UpdateByIdAsync(int postId, Post updatePost);
        //Task<Post?> DeleteByIdAsync(int postId);
    }
}
