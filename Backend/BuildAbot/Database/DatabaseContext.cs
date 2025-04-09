namespace BuildAbot.Database
{
    public class DatabaseContext : DbContext
    {
        public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options) { }
        public DbSet<User> User { get; set; }
        public DbSet<Script> Script { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .HasMany(u => u.Scripts)
                .WithOne(s => s.User)
                .OnDelete(DeleteBehavior.Cascade);

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

            modelBuilder.Entity<Script>().HasData(
                new Script
                {
                    Id = 1,
                    UserId = 1,
                    Title = "TestScript",
                    Description = "TestDescription",
                    CodeLocationId = "CodeLocation",
                    GuideLocationId = "GuideLocation",
                }
                );
        }
    }
}
