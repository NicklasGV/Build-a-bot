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
    }
}
