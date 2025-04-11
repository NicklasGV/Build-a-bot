namespace BuildAbot.DTO.CommentDTO
{
    public class CommentResponse
    {
        public int Id { get; set; }

        public string Text { get; set; }

        public DateTime CreatedAt { get; set; }

        // Optionally include the parent's ID if the comment is a reply.
        public int? ParentCommentId { get; set; }

        // A collection for nested replies.
        public List<CommentResponse> Replies { get; set; } = new();
    }
}
