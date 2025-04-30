using BuildAbot.DTO.ScriptDTO;

namespace BuildAbot.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IJwtUtils _jwtUtils;


        public UserService(IUserRepository userRepository, IJwtUtils jwtUtils)
        {
            _userRepository = userRepository;
            _jwtUtils = jwtUtils;
        }

        public async Task<LoginResponse> AuthenticateUser(LoginRequest login)
        {
            User user = await _userRepository.FindByEmail(login.Email);
            if (user == null)
            {
                return null;
            }

            if (BCrypt.Net.BCrypt.Verify(login.Password, user.Password))
            {
                LoginResponse response = new()
                {
                    Id = user.Id,
                    Email = user.Email,
                    Role = user.Role,
                    Token = _jwtUtils.GenerateJwtToken(user)
                };
                return response;
            }
            return null;
        }

        public static UserResponse MapUserToUserResponse(User user)
        {
            UserResponse response = new UserResponse
            {
                Id = user.Id,
                UserName = user.UserName,
                Email = user.Email.ToLower(),
                Role = user.Role,
                Status = user.Status == null ? null : new StatusUserResponse
                {
                    Id = user.Status.Id,
                    Title = user.Status.Title,
                    DateTime = user.Status.DateTime
                }
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

            if (user.Posts.Count > 0)
            {
                response.Posts = user.Posts.Select(x => new PostUserResponse
                {
                    Id = x.Id,
                    Title = x.Title,
                    Content = x.Content,
                }).ToList();
            }

            if (user.Comments.Count > 0)
            {
                response.Comments = user.Comments.Select(x => new CommentUserResponse
                {
                    Id = x.Id,
                    Text = x.Text,
                    PostId = x.PostId,
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
                Role = userRequest.Role,
                FavoriteScripts = (userRequest.ScriptIds ?? new List<int>())
    .Where(x => x != 0)
    .Select(x => new FavoriteScript { ScriptId = x })
    .ToList(),
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
            User insertedUser = MapUserRequestToUser(updateUser);

            if (updateUser.Password.Length >= 8)
            {
                insertedUser = await _userRepository.UpdateByIdAsync(userId, insertedUser);
            }
            else
            {
                insertedUser = await _userRepository.UpdateByIdNoPasswordAsync(userId, insertedUser);
            }
            

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
