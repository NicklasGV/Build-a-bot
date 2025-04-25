namespace BuildAbot.DTO.PostDTO
{
    public class PostResponse
    {
        public int Id { get; set; }

        public string Title { get; set; }

        public string Content { get; set; }
        public DateTime CreatedAt { get; set; }

        public UserPostResponse User { get; set; } = new();
        public List<CommentPostResponse> Comments { get; set; } = new();
    }

    public class UserPostResponse
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
    }
    public class CommentPostResponse
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public DateTime CreatedAt { get; set; }
        public int? ParentCommentId { get; set; }
        public UserCommentResponse User { get; set; } = new();
        public List<CommentPostResponse> Replies { get; set; } = new();
    }
}
