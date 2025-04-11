using Microsoft.AspNetCore.Mvc;

namespace BuildAbot.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostController : ControllerBase
    {

        private readonly IPostService _postService;

        public PostController(IPostService postService)
        {
            _postService = postService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllAsync()
        {
            try
            {
                List<PostResponse> posts = await _postService.GetAllAsync();

                if (posts == null)
                {
                    return Problem("A problem occured the team is fixing it as we speak");
                }

                if (posts.Count == 0)
                {
                    return NoContent();
                }
                return Ok(posts);
            }
            catch (Exception ex)
            {
                return Problem(ex.Message);
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> FindByIdAsync(int id)
        {
            try
            {
                PostResponse postResponse = await _postService.FindByIdAsync(id);

                if (postResponse == null)
                {
                    return NotFound();
                }
                return Ok(postResponse);
            }
            catch (Exception ex)
            {
                return Problem(ex.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateAsync([FromForm] PostRequest postRequest)
        {
            try
            {
                PostResponse postResponse = await _postService.CreateAsync(postRequest);
                if (postResponse == null)
                {
                    return Problem("A problem occured the team is fixing it as we speak");
                }
                return Ok(postResponse);
            }
            catch (Exception ex)
            {
                return Problem(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateByIdAsync(int id, [FromForm] PostRequest postRequest)
        {
            try
            {
                PostResponse postResponse = await _postService.UpdateByIdAsync(id, postRequest);
                if (postResponse == null)
                {
                    return NotFound();
                }
                return Ok(postResponse);
            }
            catch (Exception ex)
            {
                return Problem(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteByIdAsync(int id)
        {
            try
            {
                PostResponse postResponse = await _postService.DeleteByIdAsync(id);
                if (postResponse == null)
                {
                    return NotFound();
                }
                return Ok(postResponse);
            }
            catch (Exception ex)
            {
                return Problem(ex.Message);
            }
        }
    }
}
