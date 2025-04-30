namespace BuildAbot.Database.Entities
{
    public class Status
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public DateTime DateTime { get; set; }

        public List<User> Users { get; set; } = new List<User>();
        public List<Script> Scripts { get; set; } = new List<Script>();
    }
}
