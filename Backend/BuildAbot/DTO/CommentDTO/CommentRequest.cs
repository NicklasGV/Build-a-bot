namespace BuildAbot.DTO.CommentDTO
{
    public class CommentRequest
    {
        [Required]
        [StringLength(500, ErrorMessage = "Comment text cannot be longer than 500 characters")]
        public string Text { get; set; }

        // The post to which the comment belongs
        [Required]
        public int PostId { get; set; }

        // Optional parent comment Id for replies. Leave null for top-level comments.
        public int? ParentCommentId { get; set; }
    }
}
