namespace BuildAbot.Repositories
{
    public class CommentRepository : ICommentRepository
    {
        private readonly DatabaseContext _databaseContext;
        private readonly IWebHostEnvironment _hostingEnvironment;
        public CommentRepository(DatabaseContext databaseContext, IWebHostEnvironment hostingEnvironment)
        {
            _databaseContext = databaseContext;
            _hostingEnvironment = hostingEnvironment;
        }

        public async Task<List<Comment>> GetAllAsync()
        {
            return await _databaseContext.Comment
                .Include(c => c.User)
                .ToListAsync();
        }

        public async Task<Comment> FindByIdAsync(int commentId)
        {
            return await _databaseContext.Comment
                .Include(p => p.User)
                .FirstOrDefaultAsync(s => s.Id == commentId);
        }
    }
}
