using BuildAbot.DTO.CommentDTO;

namespace BuildAbot.DTO.PostDTO
{
    public class PostResponse
    {
        public int Id { get; set; }

        public string Title { get; set; }

        public string Content { get; set; }

        // List of comments for the post. Each comment can contain its own replies.
        public List<CommentResponse> Comments { get; set; } = new();
    }
}
