namespace BuildAbot.Interfaces.IUser
{
    public interface IUserRepository
    {
        Task<User?> FindByIdAsync(int userId);
        Task<User> CreateAsync(User newUser);
    }
}
