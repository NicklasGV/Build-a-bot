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

        [Authorize(Role.Admin, Role.Developer, Role.User)]
        [HttpPost]
        public async Task<IActionResult> CreateAsync([FromForm] BotRequest botRequest)
        {
            try
            {
                BotResponse botResponse = await _botService.CreateAsync(botRequest);
                if (botResponse == null)
                {
                    return Problem("A problem occured the team is fixing it as we speak");
                }
                return Ok(botResponse);
            }
            catch (Exception ex)
            {
                return Problem(ex.Message);
            }
        }

        [Authorize(Role.Admin, Role.Developer, Role.User)]
        [HttpPut]
        [Route("{botId}")]
        public async Task<IActionResult> UpdateAsync([FromRoute] int botId, [FromForm] BotRequest botRequest)
        {
            try
            {
                if (botRequest == null)
                {
                    return BadRequest();
                }
                BotResponse botResponse = await _botService.UpdateByIdAsync(botId, botRequest);
                if (botResponse == null)
                {
                    return Problem("A problem occured the team is fixing it as we speak");
                }
                return Ok(botResponse);
            }
            catch (Exception ex)
            {
                return Problem(ex.Message);
            }
        }

        [Authorize(Role.Admin, Role.Developer, Role.User)]
        [HttpDelete]
        [Route("{botId}")]
        public async Task<IActionResult> DeleteAsync([FromRoute] int botId)
        {
            try
            {
                var botResponse = await _botRepository.FindByIdAsync(botId);
                if (botResponse == null)
                {
                    return NotFound();
                }
                await _botService.DeleteByIdAsync(botId);
                return Ok(botResponse);
            }
            catch (Exception ex)
            {
                return Problem(ex.Message);
            }
        }
    }
}
