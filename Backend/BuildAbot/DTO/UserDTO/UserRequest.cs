namespace BuildAbot.DTO.UserDTO
{
    public class UserRequest
    {
        [StringLength(32, ErrorMessage = "First name cannot be longer than 32 chars")]
        public string UserName { get; set; }

        [Required]
        [StringLength(50, ErrorMessage = "Email cannot be longer than 50 chars")]
        public string Email { get; set; }

        [Required]
        [StringLength(50, ErrorMessage = "Password cannot be longer than 50 chars")]
        public string Password { get; set; }

    }
}
