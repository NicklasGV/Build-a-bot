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
    }
}