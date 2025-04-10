﻿// <auto-generated />
using BuildAbot.Database;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace BuildAbot.Migrations
{
    [DbContext(typeof(DatabaseContext))]
    partial class DatabaseContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "9.0.3")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("BuildAbot.Database.Entities.FavoriteScript", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("ScriptId")
                        .HasColumnType("int");

                    b.Property<int>("UserId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("ScriptId");

                    b.HasIndex("UserId");

                    b.ToTable("FavoriteScript");

                    b.HasData(
                        new
                        {
                            Id = 1,
                            ScriptId = 1,
                            UserId = 2
                        });
                });

            modelBuilder.Entity("BuildAbot.Database.Entities.Script", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("CodeLocationId")
                        .IsRequired()
                        .HasColumnType("nvarchar(500)");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("nvarchar(500)");

                    b.Property<string>("GuideLocationId")
                        .IsRequired()
                        .HasColumnType("nvarchar(500)");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("nvarchar(100)");

                    b.Property<int>("UserId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("Script");

                    b.HasData(
                        new
                        {
                            Id = 1,
                            CodeLocationId = "CodeLocation",
                            Description = "TestDescription",
                            GuideLocationId = "GuideLocation",
                            Title = "TestScript",
                            UserId = 1
                        });
                });

            modelBuilder.Entity("BuildAbot.Database.Entities.User", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("nvarchar(50)");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasColumnType("nvarchar(500)");

                    b.Property<string>("UserName")
                        .IsRequired()
                        .HasColumnType("nvarchar(50)");

                    b.HasKey("Id");

                    b.ToTable("User");

                    b.HasData(
                        new
                        {
                            Id = 1,
                            Email = "testmail1",
                            Password = "Passw0rd",
                            UserName = "TesterMand"
                        },
                        new
                        {
                            Id = 2,
                            Email = "testmail2",
                            Password = "Password",
                            UserName = "Supporten"
                        });
                });

            modelBuilder.Entity("BuildAbot.Database.Entities.FavoriteScript", b =>
                {
                    b.HasOne("BuildAbot.Database.Entities.Script", "Script")
                        .WithMany("FavoriteScripts")
                        .HasForeignKey("ScriptId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("BuildAbot.Database.Entities.User", "User")
                        .WithMany("FavoriteScripts")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("Script");

                    b.Navigation("User");
                });

            modelBuilder.Entity("BuildAbot.Database.Entities.Script", b =>
                {
                    b.HasOne("BuildAbot.Database.Entities.User", "User")
                        .WithMany("Scripts")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("BuildAbot.Database.Entities.Script", b =>
                {
                    b.Navigation("FavoriteScripts");
                });

            modelBuilder.Entity("BuildAbot.Database.Entities.User", b =>
                {
                    b.Navigation("FavoriteScripts");

                    b.Navigation("Scripts");
                });
#pragma warning restore 612, 618
        }
    }
}
