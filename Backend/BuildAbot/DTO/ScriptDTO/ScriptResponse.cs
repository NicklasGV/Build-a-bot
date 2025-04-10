namespace BuildAbot.DTO.ScriptDTO
{
    public class ScriptResponse
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string CodeLocationId { get; set; }
        public string GuideLocationId { get; set; }
        public UserScriptResponse User { get; set; } = new();

        public List<FavoriteScriptResponse> Favorites { get; set; } = new();
    }

    public class UserScriptResponse
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
    }

    public class FavoriteScriptResponse
    {
        public int Id { get; set; }
        public string Username { get; set; }
    }
}
