namespace BuildAbot.DTO.BotDTO
{
    public class BotResponse
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public UserBotResponse User { get; set; } = new();

        public List<BotScriptResponse> BotScripts { get; set; } = new();
    }

    public class UserBotResponse
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
    }

    public class BotScriptResponse
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string CodeLocationId { get; set; }
        public string GuideLocationId { get; set; }
    }
}
