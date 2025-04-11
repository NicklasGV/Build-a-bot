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

        public async Task<Comment> CreateAsync(Comment newComment)
        {
            _databaseContext.Comment.Add(newComment);
            await _databaseContext.SaveChangesAsync();
            newComment = await FindByIdAsync(newComment.Id);
            return newComment;
        }

        public async Task<Comment> UpdateByIdAsync(int commentId, Comment updateComment)
        {
            Comment comment = await FindByIdAsync(commentId);
            if (comment != null)
            {
                comment.Text = updateComment.Text;
                comment.CreatedAt = DateTime.Now;
                await _databaseContext.SaveChangesAsync();
                comment = await FindByIdAsync(comment.Id);
            }
            return comment;
        }

        public async Task<Comment> DeleteByIdAsync(int commentId)
        {
            var comment = await FindByIdAsync(commentId);
            if (comment != null)
            {
                _databaseContext.Comment.Remove(comment);
                await _databaseContext.SaveChangesAsync();
            }
            return comment;
        }
    }
}
