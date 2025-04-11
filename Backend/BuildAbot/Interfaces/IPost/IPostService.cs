namespace BuildAbot.Interfaces.IPost
{
    public interface IPostService
    {
        Task<List<PostResponse>> GetAllAsync();
        Task<PostResponse?> FindByIdAsync(int postId);
        //Task<Post> CreateAsync(Post newPost);
        //Task<Post> UpdateByIdAsync(int postId, Post updatePost);
        //Task<Post?> DeleteByIdAsync(int postId);
    }
}
