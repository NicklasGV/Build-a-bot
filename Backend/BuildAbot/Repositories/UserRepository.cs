namespace BuildAbot.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly DatabaseContext _databaseContext;
        private readonly IWebHostEnvironment _hostingEnvironment;
        public UserRepository(DatabaseContext databaseContext, IWebHostEnvironment hostingEnvironment)
        {
            _databaseContext = databaseContext;
            _hostingEnvironment = hostingEnvironment;
        }

        public async Task<User> FindByIdAsync(int userId)
        {
            return await _databaseContext.User
                .FirstOrDefaultAsync(u => u.Id == userId);
        }
    }
}
