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
        public DbSet<Post> Post { get; set; }
        public DbSet<Comment> Comment { get; set; }

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
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<BotScript>()
                .HasOne(bs => bs.Bot)
                .WithMany(b => b.BotScripts)
                .HasForeignKey(bs => bs.BotId);

            modelBuilder.Entity<BotScript>()
                .HasOne(bs => bs.Script)
                .WithMany(s => s.BotScripts)
                .HasForeignKey(bs => bs.ScriptId);

            modelBuilder.Entity<Comment>()
                .HasOne(c => c.Post)
                .WithMany(p => p.Comments)
                .HasForeignKey(c => c.PostId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Comment>()
               .HasOne(c => c.ParentComment)
               .WithMany(c => c.ChildComments)
               .HasForeignKey(c => c.ParentCommentId)
               .IsRequired(false);

            modelBuilder.Entity<Post>()
                .HasOne(p => p.User)
                .WithMany(u => u.Posts)
                .HasForeignKey(s => s.UserId);

            modelBuilder.Entity<Comment>()
                .HasOne(c => c.User)
                .WithMany(u => u.Comments)
                .HasForeignKey(s => s.UserId);

            modelBuilder.Entity<User>()
                .HasMany(u => u.Posts)
                .WithOne(p => p.User)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<User>()
                .HasMany(u => u.Comments)
                .WithOne(c => c.User)
                .OnDelete(DeleteBehavior.Cascade);


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

            modelBuilder.Entity<Post>().HasData(
                new Post
                {
                    Id = 1,
                    Title = "TestPost",
                    Content = "TestContent",
                    CreatedAt = new DateTime(2025, 4, 11, 8, 42, 46, 281, DateTimeKind.Local).AddTicks(6772),
                    UserId = 1
                }
            );

            modelBuilder.Entity<Comment>().HasData(
                new Comment
                {
                    Id = 1,
                    Text = "TestTopComment",
                    CreatedAt = new DateTime(2025, 4, 11, 8, 42, 46, 281, DateTimeKind.Local).AddTicks(6772),
                    UserId = 1,
                    PostId = 1
                },
                new Comment
                {
                    Id = 2,
                    Text = "TestChildComment",
                    CreatedAt = new DateTime(2025, 4, 11, 8, 42, 46, 281, DateTimeKind.Local).AddTicks(6772),
                    UserId = 2,
                    PostId = 1,
                    ParentCommentId = 1
                }
            );
        }
    }
}
