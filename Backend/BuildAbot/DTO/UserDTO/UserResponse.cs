namespace BuildAbot.DTO.UserDTO
{
    public class UserResponse
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }

        public List<ScriptUserResponse> Scripts { get; set; } = new();
    }

    public class ScriptUserResponse
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
    }
}
