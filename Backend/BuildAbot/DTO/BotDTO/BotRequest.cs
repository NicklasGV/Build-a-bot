namespace BuildAbot.DTO.BotDTO
{
    public class BotRequest
    {
        public int UserId { get; set; }

        [StringLength(64, ErrorMessage = "Bot Name cannot be longer than 64 chars")]
        public string Name { get; set; }

        public List<int> ScriptIds { get; set; } = new();
    }
}
