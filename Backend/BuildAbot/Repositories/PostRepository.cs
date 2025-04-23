namespace BuildAbot.Repositories
{
    public class PostRepository : IPostRepository
    {
        private readonly DatabaseContext _databaseContext;
        private readonly IWebHostEnvironment _hostingEnvironment;
        public PostRepository(DatabaseContext databaseContext, IWebHostEnvironment hostingEnvironment)
        {
            _databaseContext = databaseContext;
            _hostingEnvironment = hostingEnvironment;
        }

        public async Task<List<Post>> GetAllAsync()
        {
            return await _databaseContext.Post
                .Include(p => p.User)
                .Include(p => p.Comments)
                .ThenInclude(c => c.User)
                .ToListAsync();
        }

        public async Task<Post> FindByIdAsync(int postId)
        {
            return await _databaseContext.Post
                .Include(p => p.User)
                .Include(p => p.Comments)
                .ThenInclude(c => c.User)
                .FirstOrDefaultAsync(s => s.Id == postId);
        }

        public async Task<Post> CreateAsync(Post newPost)
        {
            _databaseContext.Post.Add(newPost);
            await _databaseContext.SaveChangesAsync();
            newPost = await FindByIdAsync(newPost.Id);
            return newPost;
        }

        public async Task<Post> UpdateByIdAsync(int postId, Post updatePost)
        {
            Post post = await FindByIdAsync(postId);
            if (post != null)
            {
                post.UserId = updatePost.UserId;
                post.Title = updatePost.Title;
                post.Content = updatePost.Content;
                await _databaseContext.SaveChangesAsync();
                post = await FindByIdAsync(post.Id);
            }
            return post;
        }

        public async Task<Post> DeleteByIdAsync(int postId)
        {
            var post = await FindByIdAsync(postId);
            if (post != null)
            {
                _databaseContext.Post.Remove(post);
                await _databaseContext.SaveChangesAsync();
            }
            return post;
        }
    }
}
