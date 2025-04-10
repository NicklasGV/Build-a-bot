namespace BuildAbot.Database
{
    public class DatabaseContext : DbContext
    {
        public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options) { }
        public DbSet<User> User { get; set; }
        public DbSet<Script> Script { get; set; }
        public DbSet<FavoriteScript> FavoriteScript { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .HasMany(u => u.Scripts)
                .WithOne(s => s.User)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Script>()
                .HasOne(s => s.User)
                .WithMany(u => u.Scripts)
                .HasForeignKey(s => s.UserId);

            modelBuilder.Entity<User>()
                .HasMany(u => u.FavoriteScripts)
                .WithOne(f => f.User)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Script>()
                .HasMany(s => s.FavoriteScripts)
                .WithOne(f => f.Script)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<FavoriteScript>()
                .HasOne(fs => fs.User)
                .WithMany(u => u.FavoriteScripts)
                .HasForeignKey(f => f.UserId);

            modelBuilder.Entity<FavoriteScript>()
                .HasOne(fs => fs.Script)
                .WithMany(s => s.FavoriteScripts)
                .HasForeignKey(f => f.ScriptId);

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

            modelBuilder.Entity<FavoriteScript>().HasData(
                new FavoriteScript
                {
                    Id = 1,
                    UserId = 2,
                    ScriptId = 1,
                }
                );
        }
    }
}
