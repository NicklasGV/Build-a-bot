﻿namespace BuildAbot.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly IStatusRepository _statusRepository;
        private readonly DatabaseContext _databaseContext;
        private readonly IWebHostEnvironment _hostingEnvironment;
        public UserRepository(DatabaseContext databaseContext, IStatusRepository statusRepository, IWebHostEnvironment hostingEnvironment)
        {
            _statusRepository = statusRepository;
            _databaseContext = databaseContext;
            _hostingEnvironment = hostingEnvironment;
        }

        public async Task<List<User>> GetAllAsync()
        {
            return await _databaseContext.User
                .Include(u => u.Scripts)
                .Include(u => u.Bots)
                .Include(u => u.FavoriteScripts)
                .ThenInclude(f => f.Script)
                .Include(u => u.Posts)
                .Include(u => u.Comments)
                .Include(u => u.Status)
                .ToListAsync();
        }

        public async Task<User> FindByIdAsync(int userId)
        {
            return await _databaseContext.User
                .Include(u => u.Scripts)
                .Include(u => u.Bots)
                .Include(u => u.FavoriteScripts)
                .ThenInclude(f => f.Script)
                .Include(u => u.Posts)
                .Include(u => u.Comments)
                .Include(u => u.Status)
                .FirstOrDefaultAsync(u => u.Id == userId);
        }

        public async Task<User> FindByEmail(string email)
        {
            return await _databaseContext.User.FirstOrDefaultAsync(u => u.Email == email);
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
                user.Role = updateUser.Role;
                if (user.StatusId != updateUser.StatusId)
                {
                    await _statusRepository.DeleteByIdAsync((int)user.StatusId);
                    user.StatusId = updateUser.StatusId;

                }

                await _databaseContext.SaveChangesAsync();

                user = await FindByIdAsync(user.Id);
            }
            return user;
        }

        public async Task<User> UpdateByIdNoPasswordAsync(int userId, User updateUser)
        {
            User user = await FindByIdAsync(userId);
            if (user != null)
            {
                user.UserName = updateUser.UserName;
                user.Email = updateUser.Email;
                user.Role = updateUser.Role;
                if (user.StatusId != updateUser.StatusId)
                {
                    await _statusRepository.DeleteByIdAsync((int)user.StatusId);
                    user.StatusId = updateUser.StatusId;

                }

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
    }
}
