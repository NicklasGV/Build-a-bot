namespace BuildAbot.Database
{
    public class DatabaseContext : DbContext
    {
        public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options) { }
        public DbSet<User> User { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().HasData(
                new User
                {
                    Id = 1,
                    UserName = "TesterMand",
                    Email = "testmail1",
                    Password = "Passw0rd",
                },
                new User
                {
                    Id = 2,
                    UserName = "Supporten",
                    Email = "testmail2",
                    Password = "Password",
                }
                );
        }
    }
}
