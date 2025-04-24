namespace BuildAbot.DTO.LoginDTO
{
    public class LoginRequest
    {
        [Required]
        [StringLength(80, ErrorMessage = "Mail cannot be longer than 80 characters")]
        public string Email { get; set; }
        [Required]
        [StringLength(100, ErrorMessage = "Password cannot be longer than 100 characters")]
        public string Password { get; set; }
    }
}
