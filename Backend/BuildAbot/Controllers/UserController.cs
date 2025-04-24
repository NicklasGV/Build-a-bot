namespace BuildAbot.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IUserRepository _userRepository;


        public UserController(IUserService userService, IUserRepository userRepository)
        {
            _userService = userService;
            _userRepository = userRepository;
        }

        [AllowAnnonymous]
        [HttpPost]
        [Route("authenticate")]
        public async Task<IActionResult> AuthenticateAsync([FromBody] LoginRequest login)
        {
            try
            {
                LoginResponse user = await _userService.AuthenticateUser(login);
                if (user == null)
                {
                    return Unauthorized();
                }
                return Ok(user);
            }
            catch (Exception ex)
            {
                return Problem(ex.Message);
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAllAsync()
        {
            try
            {
                List<UserResponse> users = await _userService.GetAllAsync();

                if (users == null)
                {
                    return Problem("A problem occured the team is fixing it as we speak");
                }

                if (users.Count == 0)
                {
                    return NoContent();
                }
                return Ok(users);
            }
            catch (Exception ex)
            {
                return Problem(ex.Message);
            }
        }

        [HttpGet]
        [Route("{userId}")]
        public async Task<IActionResult> FindByIdAsync([FromRoute] int userId)
        {
            try
            {
                UserResponse userResponse = await _userService.FindByIdAsync(userId);

                if (userResponse == null)
                {
                    return NotFound();
                }
                return Ok(userResponse);
            }
            catch (Exception ex)
            {
                return Problem(ex.Message);
            }
        }

        [HttpPost]
        [Route("register")]
        public async Task<IActionResult> CreateAsync([FromForm] UserRequest newUser)
        {
            try
            {
                UserResponse userResponse = await _userService.CreateAsync(newUser);

                return Ok(userResponse);
            }
            catch (Exception ex)
            {
                return Problem(ex.Message);
            }
        }

        [HttpPut]
        [Route("{userId}")]
        public async Task<IActionResult> UpdateByIdAsync([FromRoute] int userId, [FromForm] UserRequest updateUser)
        {
            try
            {
                var userResponse = await _userService.UpdateByIdAsync(userId, updateUser);

                if (userResponse == null)
                {
                    return NotFound();
                }

                return Ok(userResponse);
            }
            catch (Exception ex)
            {
                return Problem(ex.Message);
            }
        }

        [HttpDelete]
        [Route("{userId}")]
        public async Task<IActionResult> DeleteByIdAsync([FromRoute] int userId)
        {
            try
            {
                var userResponse = await _userService.DeleteByIdAsync(userId);
                if (userResponse == null)
                {
                    return NotFound();
                }
                return Ok(userResponse);
            }
            catch (Exception ex)
            {

                return Problem(ex.Message);
            }
        }
    }
}