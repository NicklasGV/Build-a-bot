using BuildAbot.Database.Entities;

namespace BuildAbot.Database
{
    public class DatabaseContext : DbContext
    {
        public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options) { }
        public DbSet<User> User { get; set; }
        public DbSet<Script> Script { get; set; }
        public DbSet<FavoriteScript> FavoriteScript { get; set; }
        public DbSet<Bot> Bot { get; set; }
        public DbSet<BotScript> BotScript { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .HasMany(u => u.Scripts)
                .WithOne(s => s.User)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Script>()
                .HasOne(s => s.User)
                .WithMany(u => u.Scripts)
                .HasForeignKey(s => s.UserId);

            modelBuilder.Entity<User>()
                .HasMany(u => u.Bots)
                .WithOne(b => b.User)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Bot>()
                .HasOne(b => b.User)
                .WithMany(u => u.Bots)
                .HasForeignKey(b => b.UserId);

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

            modelBuilder.Entity<Bot>()
                .HasMany(b => b.BotScripts)
                .WithOne(bs => bs.Bot)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Script>()
                .HasMany(s => s.BotScripts)
                .WithOne(bs => bs.Script)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<BotScript>()
                .HasOne(bs => bs.Bot)
                .WithMany(b => b.BotScripts)
                .HasForeignKey(bs => bs.BotId);

            modelBuilder.Entity<BotScript>()
                .HasOne(bs => bs.Script)
                .WithMany(s => s.BotScripts)
                .HasForeignKey(bs => bs.ScriptId);


            // Dummy data for testing
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

            modelBuilder.Entity<Bot>().HasData(
                new Bot
                {
                    Id = 1,
                    Name = "TestBot",
                    UserId = 1
                }
                );

            modelBuilder.Entity<BotScript>().HasData(
                new BotScript
                {
                    Id = 1,
                    BotId = 1,
                    ScriptId = 1
                }
                );
        }
    }
}
