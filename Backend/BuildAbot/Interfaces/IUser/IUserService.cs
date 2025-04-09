namespace BuildAbot.Interfaces.IUser
{
    public interface IUserService
    {
        Task<UserResponse?> FindByIdAsync(int userId);
        Task<UserResponse> CreateAsync(UserRequest newUser);
        Task<UserResponse?> UpdateByIdAsync(int userId, UserRequest updateUser);
        Task<UserResponse> DeleteByIdAsync(int userId);
        Task<List<UserResponse>> GetAllAsync();
    }
}
