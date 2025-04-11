namespace BuildAbot.Database.Entities
{
    public class BotScript
    {
        [Key]
        public int Id { get; set; }

        public int BotId { get; set; }
        public Bot Bot { get; set; }

        public int ScriptId { get; set; }
        public Script Script { get; set; }
    }
}
