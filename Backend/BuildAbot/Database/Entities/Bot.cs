namespace BuildAbot.Database.Entities
{
    public class Bot
    {
        [Key]
        public int Id { get; set; }

        public int UserId { get; set; }
        public User User { get; set; }

        [Column(TypeName = "nvarchar(100)")]
        public string Name { get; set; }

        public List<BotScript> BotScripts { get; set; } = new List<BotScript>();
    }
}
