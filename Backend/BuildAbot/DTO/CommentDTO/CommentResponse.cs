namespace BuildAbot.DTO.CommentDTO
{
    public class CommentResponse
    {
        public int Id { get; set; }
        public int PostId { get; set; }

        public string Text { get; set; }

        public DateTime CreatedAt { get; set; }

        public Boolean? IsDeleted { get; set; }
        public int? ParentCommentId { get; set; }

        
        public UserCommentResponse User { get; set; } = new();
        public List<CommentResponse> Replies { get; set; } = new();
    }

    public class UserCommentResponse
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
    }
}
