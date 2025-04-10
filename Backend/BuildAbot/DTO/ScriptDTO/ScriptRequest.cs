namespace BuildAbot.DTO.ScriptDTO
{
    public class ScriptRequest
    {
        public int UserId { get; set; }

        [StringLength(64, ErrorMessage = "Title cannot be longer than 64 chars")]
        public string Title { get; set; }

        [Required]
        [StringLength(500, ErrorMessage = "Description cannot be longer than 500 chars")]
        public string Description { get; set; }

        [Required]
        [StringLength(500, ErrorMessage = "Code locations path cannot be longer than 500 chars")]
        public string CodeLocationId { get; set; }

        [Required]
        [StringLength(500, ErrorMessage = "Guide locations path cannot be longer than 500 chars")]
        public string GuideLocationId { get; set; }

        public List<int> UserIds { get; set; } = new();
    }
}
