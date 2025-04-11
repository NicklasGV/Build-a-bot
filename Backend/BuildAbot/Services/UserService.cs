namespace BuildAbot.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;


        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public static UserResponse MapUserToUserResponse(User user)
        {
            UserResponse response = new UserResponse
            {
                Id = user.Id,
                UserName = user.UserName,
                Email = user.Email.ToLower(),
            };
            
            if (user.Scripts.Count > 0)
            {      
                response.Scripts = user.Scripts.Select(x => new ScriptUserResponse
                {
                    Id = x.Id,
                    Title = x.Title,
                    Description = x.Description,
                    CodeLocationId = x.CodeLocationId,
                    GuideLocationId = x.GuideLocationId,
                }).ToList();
            }

            if (user.Bots.Count > 0)
            {
                response.Bots = user.Bots.Select(x => new BotUserResponse
                {
                    Id = x.Id,
                    Name = x.Name,
                }).ToList();
            }

            if (user.FavoriteScripts.Count > 0)
            {
                response.Favorites = user.FavoriteScripts.Select(x => new FavoriteScriptUserResponse
                {
                    Id = x.Script.Id,
                    Title = x.Script.Title,
                }).ToList();
            }

            return response;
        }

        private static User MapUserRequestToUser(UserRequest userRequest)
        {
            User user = new User
            {
                UserName = userRequest.UserName,
                Email = userRequest.Email.ToLower(),
                Password = BCrypt.Net.BCrypt.HashPassword(userRequest.Password) ?? string.Empty,
            };
            return user;
        }

        public async Task<List<UserResponse>> GetAllAsync()
        {
            List<User> users = await _userRepository.GetAllAsync();

            if (users == null)
            {
                throw new ArgumentException();
            }
            return users.Select(MapUserToUserResponse).ToList();
        }

        public async Task<UserResponse> FindByIdAsync(int userId)
        {
            var user = await _userRepository.FindByIdAsync(userId);

            if (user != null)
            {
                return MapUserToUserResponse(user);
            }

            return null;
        }

        public async Task<UserResponse> CreateAsync(UserRequest newUser)
        {
            var user = await _userRepository.CreateAsync(MapUserRequestToUser(newUser));
            if (user == null)
            {
                throw new ArgumentNullException();
            }
            return MapUserToUserResponse(user);
        }

        public async Task<UserResponse> UpdateByIdAsync(int userId, UserRequest updateUser)
        {
            var insertedUser = await _userRepository.UpdateByIdAsync(userId, MapUserRequestToUser(updateUser));

            if (insertedUser != null)
            {
                return MapUserToUserResponse(insertedUser);
            }

            return null;
        }

        public async Task<UserResponse> DeleteByIdAsync(int userId)
        {
            var user = await _userRepository.DeleteByIdAsync(userId);

            if (user != null)
            {
                return MapUserToUserResponse(user);
            }
            return null;
        }

    }
}
