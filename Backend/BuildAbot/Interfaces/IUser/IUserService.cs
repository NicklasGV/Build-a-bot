namespace BuildAbot.Interfaces.IUser
{
    public interface IUserService
    {
        Task<LoginResponse> AuthenticateUser(LoginRequest login);
        Task<UserResponse?> FindByIdAsync(int userId);
        Task<UserResponse> CreateAsync(UserRequest newUser);
        Task<UserResponse?> UpdateByIdAsync(int userId, UserRequest updateUser);
        Task<UserResponse> DeleteByIdAsync(int userId);
        Task<UserResponse> SoftDeleteByIdAsync(int userId);
        Task<List<UserResponse>> GetAllAsync();
    }
}
