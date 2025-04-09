using System.Data;

namespace BuildAbot.Database.Entities
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Column(TypeName = "nvarchar(50)")]
        public string UserName { get; set; }

        [Column(TypeName = "nvarchar(50)")]
        public string Email { get; set; }

        [Column(TypeName = "nvarchar(500)")]
        public string Password { get; set; }

        public List<Script> Scripts { get; set; } = new List<Script>();
    }
}
