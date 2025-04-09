namespace BuildAbot.Interfaces.IUser
{
    public interface IUserService
    {
        Task<UserResponse?> FindByIdAsync(int userId);
        Task<UserResponse> CreateAsync(UserRequest newUser);
    }
}
