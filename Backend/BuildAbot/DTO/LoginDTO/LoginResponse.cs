namespace BuildAbot.DTO.LoginDTO
{
    public class LoginResponse
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public Role Role { get; set; }
        public string Token { get; set; }
    }
}
