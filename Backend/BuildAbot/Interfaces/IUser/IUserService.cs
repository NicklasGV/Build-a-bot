namespace BuildAbot.Interfaces.IUser
{
    public interface IUserService
    {
        Task<UserResponse?> FindByIdAsync(int userId);
    }
}
