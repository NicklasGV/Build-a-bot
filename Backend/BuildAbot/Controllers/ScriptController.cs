using BuildAbot.DTO.UserDTO;

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
        public async Task<IActionResult> GetAllAsync()
        {
            try
            {
                List<ScriptResponse> scripts = await _scriptService.GetAllAsync();

                if (scripts == null)
                {
                    return Problem("A problem occured the team is fixing it as we speak");
                }

                if (scripts.Count == 0)
                {
                    return NoContent();
                }
                return Ok(scripts);
            }
            catch (Exception ex)
            {
                return Problem(ex.Message);
            }
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
        [Route("create")]
        public async Task<IActionResult> CreateAsync([FromForm] ScriptRequest newScript)
        {
            try
            {
                ScriptResponse scriptResponse = await _scriptService.CreateAsync(newScript);

                if (newScript.ScriptFile != null)
                {
                    ScriptResponse scriptFile = await _scriptService.UploadScriptFile(scriptResponse.Id, newScript.ScriptFile);

                    if (scriptFile != null)
                    {
                        scriptResponse = scriptFile;
                    }

                }

                if (newScript.GuideFile != null)
                {
                    ScriptResponse guideFile = await _scriptService.UploadGuideFile(scriptResponse.Id, newScript.GuideFile);

                    if (guideFile != null)
                    {
                        scriptResponse = guideFile;
                    }

                }

                return Ok(scriptResponse);
            }
            catch (Exception ex)
            {
                return Problem(ex.Message);
            }
        }

        [HttpPut]
        [Route("{scriptId}")]
        public async Task<IActionResult> UpdateByIdAsync([FromRoute] int scriptId, [FromForm] ScriptRequest updateScript)
        {
            try
            {
                var scriptResponse = await _scriptService.UpdateByIdAsync(scriptId, updateScript);

                if (updateScript.ScriptFile != null)
                {
                    ScriptResponse scriptFile = await _scriptService.UploadScriptFile(scriptResponse.Id, updateScript.ScriptFile);

                    if (scriptFile != null)
                    {
                        scriptResponse = scriptFile;
                    }

                }

                if (updateScript.GuideFile != null)
                {
                    ScriptResponse guideFile = await _scriptService.UploadGuideFile(scriptResponse.Id, updateScript.GuideFile);

                    if (guideFile != null)
                    {
                        scriptResponse = guideFile;
                    }

                }

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

        [HttpDelete]
        [Route("{scriptId}")]
        public async Task<IActionResult> DeleteByIdAsync([FromRoute] int scriptId)
        {
            try
            {
                var scriptResponse = await _scriptService.DeleteByIdAsync(scriptId);
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

        [HttpDelete]
        [Route("Status/{scriptId}")]
        public async Task<IActionResult> SoftDeleteByIdAsync([FromRoute] int scriptId)
        {
            try
            {
                var scriptResponse = await _scriptService.SoftDeleteByIdAsync(scriptId);
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
    }
}
