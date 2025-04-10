namespace BuildAbot.DTO.UserDTO
{
    public class UserResponse
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }

        public List<ScriptUserResponse> Scripts { get; set; } = new();
        public List<FavoriteScriptUserResponse> Favorites { get; set; } = new();
    }

    public class ScriptUserResponse
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string CodeLocationId { get; set; }
        public string GuideLocationId { get; set; }
    }

    public class FavoriteScriptUserResponse
    {
        public int Id { get; set; }
        public string Title { get; set; }
    }
}
