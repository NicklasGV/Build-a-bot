namespace BuildAbot.Interfaces.IPost
{
    public interface IPostService
    {
        Task<List<PostResponse>> GetAllAsync();
        Task<PostResponse?> FindByIdAsync(int postId);
        Task<PostResponse> CreateAsync(PostRequest newPost);
        Task<PostResponse> UpdateByIdAsync(int postId, PostRequest updatePost);
        Task<PostResponse?> DeleteByIdAsync(int postId);
    }
}
