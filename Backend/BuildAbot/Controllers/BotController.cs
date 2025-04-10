using BuildAbot.Database.Entities;

namespace BuildAbot.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BotController : ControllerBase
    {
        private readonly IBotService _botService;
        private readonly IBotRepository _botRepository;


        public BotController(IBotService botService, IBotRepository botRepository)
        {
            _botService = botService;
            _botRepository = botRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllAsync()
        {
            try
            {
                List<BotResponse> bots = await _botService.GetAllAsync();

                if (bots == null)
                {
                    return Problem("A problem occured the team is fixing it as we speak");
                }

                if (bots.Count == 0)
                {
                    return NoContent();
                }
                return Ok(bots);
            }
            catch (Exception ex)
            {
                return Problem(ex.Message);
            }
        }

        [HttpGet]
        [Route("{botId}")]
        public async Task<IActionResult> FindByIdAsync([FromRoute] int botId)
        {
            try
            {
                BotResponse botResponse = await _botService.FindByIdAsync(botId);

                if (botResponse == null)
                {
                    return NotFound();
                }
                return Ok(botResponse);
            }
            catch (Exception ex)
            {
                return Problem(ex.Message);
            }
        }
    }
}
