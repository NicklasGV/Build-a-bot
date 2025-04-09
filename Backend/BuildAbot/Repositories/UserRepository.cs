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

        public async Task<User> CreateAsync(User newUser)
        {
            _databaseContext.User.Add(newUser);
            await _databaseContext.SaveChangesAsync();
            return newUser;
        }

        public async Task<User> UpdateByIdAsync(int userId, User updateUser)
        {
            User user = await FindByIdAsync(userId);
            if (user != null)
            {
                user.UserName = updateUser.UserName;
                user.Email = updateUser.Email;
                user.Password = updateUser.Password;

                await _databaseContext.SaveChangesAsync();

                user = await FindByIdAsync(user.Id);
            }
            return user;
        }

        public async Task<User> DeleteByIdAsync(int userId)
        {
            var user = await FindByIdAsync(userId);

            if (user != null)
            {
                _databaseContext.Remove(user);
                await _databaseContext.SaveChangesAsync();
            }
            return user;
        }

        public async Task<List<User>> GetAllAsync()
        {
            return await _databaseContext.User
                .ToListAsync();
        }
    }
}
