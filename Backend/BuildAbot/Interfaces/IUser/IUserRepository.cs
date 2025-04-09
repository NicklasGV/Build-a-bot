namespace BuildAbot.Interfaces.IUser
{
    public interface IUserRepository
    {
        Task<User?> FindByIdAsync(int userId);
        Task<User> CreateAsync(User newUser);
        Task<User?> UpdateByIdAsync(int userId, User updateUser);
        Task<User?> DeleteByIdAsync(int userId);
        Task<List<User>> GetAllAsync();

    }
}
