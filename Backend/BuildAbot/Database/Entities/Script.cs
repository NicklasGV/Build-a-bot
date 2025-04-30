namespace BuildAbot.Database.Entities
{
    public class Script
    {
        [Key]
        public int Id { get; set; }

        public int UserId { get; set; }
        public User User { get; set; }

        [Column(TypeName = "nvarchar(100)")]
        public string Title { get; set; }

        [Column(TypeName = "nvarchar(500)")]
        public string Description { get; set; }

        [Column(TypeName = "nvarchar(500)")]
        public string? CodeLocationId { get; set; }

        [Column(TypeName = "nvarchar(500)")]
        public string? GuideLocationId { get; set; }

        public int? StatusId { get; set; }
        public Status? Status { get; set; }


        public List<FavoriteScript> FavoriteScripts { get; set; } = new List<FavoriteScript>();
        public List<BotScript> BotScripts { get; set; } = new List<BotScript>();

    }
}
