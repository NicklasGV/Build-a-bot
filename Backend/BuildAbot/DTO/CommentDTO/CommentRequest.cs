namespace BuildAbot.DTO.CommentDTO
{
    public class CommentRequest
    {
        [Required]
        [StringLength(500, ErrorMessage = "Comment text cannot be longer than 500 characters")]
        public string Text { get; set; }

        [Required]
        public int PostId { get; set; }

        [Required]
        public int UserId { get; set; }

        public int? ParentCommentId { get; set; }
    }
}
