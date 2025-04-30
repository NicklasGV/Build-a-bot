namespace BuildAbot.DTO.CommentDTO
{
    public class CommentRequest
    {
        [Required]
        [StringLength(500, ErrorMessage = "Comment text cannot be longer than 500 characters")]
        public string Text { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Required]
        public int PostId { get; set; }
     
        public int? UserId { get; set; }
        public Boolean? isDeleted { get; set; } = false;

        public int? ParentCommentId { get; set; }
    }
}
