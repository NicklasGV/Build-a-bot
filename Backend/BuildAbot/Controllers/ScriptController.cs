namespace BuildAbot.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ScriptController : ControllerBase
    {
        private readonly IScriptService _scriptService;
        private readonly IScriptRepository _scriptRepository;


        public ScriptController(IScriptService scriptService, IScriptRepository scriptRepository)
        {
            _scriptService = scriptService;
            _scriptRepository = scriptRepository;
        }

        [HttpGet]
        [Route("{scriptId}")]
        public async Task<IActionResult> FindByIdAsync([FromRoute] int scriptId)
        {
            try
            {
                ScriptResponse scriptResponse = await _scriptService.FindByIdAsync(scriptId);

                if (scriptResponse == null)
                {
                    return NotFound();
                }
                return Ok(scriptResponse);
            }
            catch (Exception ex)
            {
                return Problem(ex.Message);
            }
        }

        [HttpPost]
        [Route("register")]
        public async Task<IActionResult> CreateAsync([FromForm] ScriptRequest newScript)
        {
            try
            {
                ScriptResponse scriptResponse = await _scriptService.CreateAsync(newScript);

                return Ok(scriptResponse);
            }
            catch (Exception ex)
            {
                return Problem(ex.Message);
            }
        }
    }
}
