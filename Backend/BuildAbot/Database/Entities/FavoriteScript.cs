namespace BuildAbot.Database.Entities
{
    public class FavoriteScript
    {
        [Key]
        public int Id { get; set; }

        public int UserId { get; set; }
        public User User { get; set; }

        public int ScriptId { get; set; }
        public Script Script { get; set; }
    }
}
