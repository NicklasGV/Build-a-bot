using Microsoft.AspNetCore.Mvc;

namespace BuildAbot.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommentController : ControllerBase
    {

        private readonly ICommentService _commentService;

        public CommentController(ICommentService commentService)
        {
            _commentService = commentService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllAsync()
        {
            try
            {
                List<CommentResponse> comments = await _commentService.GetAllAsync();

                if (comments == null)
                {
                    return Problem("A problem occured the team is fixing it as we speak");
                }

                if (comments.Count == 0)
                {
                    return NoContent();
                }
                return Ok(comments);
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
                CommentResponse commentResponse = await _commentService.FindByIdAsync(id);

                if (commentResponse == null)
                {
                    return NotFound();
                }
                return Ok(commentResponse);
            }
            catch (Exception ex)
            {
                return Problem(ex.Message);
            }
        }
    }
}
