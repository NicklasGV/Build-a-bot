namespace BuildAbot.DTO.ScriptDTO
{
    public class ScriptRequest
    {
        [Required]
        public int UserId { get; set; }

        [Required]
        [StringLength(64, ErrorMessage = "Title cannot be longer than 64 chars")]
        public string Title { get; set; }

        [Required]
        [StringLength(500, ErrorMessage = "Description cannot be longer than 500 chars")]
        public string Description { get; set; }

        [StringLength(500, ErrorMessage = "Code locations path cannot be longer than 500 chars")]
        public string? CodeLocationId { get; set; }
        public IFormFile? ScriptFile { get; set; }
        
        [StringLength(500, ErrorMessage = "Guide locations path cannot be longer than 500 chars")]
        public string? GuideLocationId { get; set; }
        public IFormFile? GuideFile { get; set; }

        public int? StatusId { get; set; } = null;

        public List<int>? UserIds { get; set; } = null;
        public List<int>? BotIds { get; set; } = null;
    }
}
