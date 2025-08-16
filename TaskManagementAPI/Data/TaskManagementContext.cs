using Microsoft.EntityFrameworkCore;
using TaskManagementAPI.Models;

namespace TaskManagementAPI.Data
{
    public class TaskManagementContext : DbContext
    {
        public TaskManagementContext(DbContextOptions<TaskManagementContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Group> Groups { get; set; }
        public DbSet<GroupMember> GroupMembers { get; set; }
        public DbSet<TaskItem> Tasks { get; set; }
        public DbSet<TaskComment> TaskComments { get; set; }
        public DbSet<TaskHistory> TaskHistories { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure User entity
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasIndex(e => e.Email).IsUnique();
                entity.Property(e => e.CreatedDate).HasDefaultValueSql("GETUTCDATE()");
            });

            // Configure Group entity
            modelBuilder.Entity<Group>(entity =>
            {
                entity.Property(e => e.CreatedDate).HasDefaultValueSql("GETUTCDATE()");
                entity.HasOne(g => g.Owner)
                      .WithMany(u => u.OwnedGroups)
                      .HasForeignKey(g => g.OwnerId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // Configure GroupMember entity
            modelBuilder.Entity<GroupMember>(entity =>
            {
                entity.HasIndex(e => new { e.GroupId, e.UserId }).IsUnique();
                entity.Property(e => e.JoinedDate).HasDefaultValueSql("GETUTCDATE()");
            });

            // Configure TaskItem entity
            modelBuilder.Entity<TaskItem>(entity =>
            {
                entity.Property(e => e.CreatedDate).HasDefaultValueSql("GETUTCDATE()");
                entity.Property(e => e.LastUpdated).HasDefaultValueSql("GETUTCDATE()");

                entity.HasOne(t => t.CreatedBy)
                      .WithMany(u => u.CreatedTasks)
                      .HasForeignKey(t => t.CreatedById)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(t => t.AssignedTo)
                      .WithMany(u => u.AssignedTasks)
                      .HasForeignKey(t => t.AssignedToId)
                      .OnDelete(DeleteBehavior.SetNull);

                entity.HasOne(t => t.Group)
                      .WithMany(g => g.Tasks)
                      .HasForeignKey(t => t.GroupId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // Configure TaskComment entity
            modelBuilder.Entity<TaskComment>(entity =>
            {
                entity.Property(e => e.CreatedDate).HasDefaultValueSql("GETUTCDATE()");
            });

            // Configure TaskHistory entity
            modelBuilder.Entity<TaskHistory>(entity =>
            {
                entity.Property(e => e.ChangedDate).HasDefaultValueSql("GETUTCDATE()");
            });

            // Seed data
            SeedData(modelBuilder);
        }

        private void SeedData(ModelBuilder modelBuilder)
        {
            // Seed Users
            modelBuilder.Entity<User>().HasData(
                new User { Id = 1, Name = "Admin User", Email = "admin@company.com", Role = "Admin", CreatedDate = DateTime.UtcNow },
                new User { Id = 2, Name = "John Manager", Email = "john@company.com", Role = "Manager", CreatedDate = DateTime.UtcNow },
                new User { Id = 3, Name = "Jane Developer", Email = "jane@company.com", Role = "User", CreatedDate = DateTime.UtcNow },
                new User { Id = 4, Name = "Bob Tester", Email = "bob@company.com", Role = "User", CreatedDate = DateTime.UtcNow }
            );

            // Seed Groups
            modelBuilder.Entity<Group>().HasData(
                new Group { Id = 1, Name = "Development Team", Description = "Main development team", OwnerId = 2, CreatedDate = DateTime.UtcNow },
                new Group { Id = 2, Name = "QA Team", Description = "Quality Assurance team", OwnerId = 2, CreatedDate = DateTime.UtcNow }
            );

            // Seed Group Members
            modelBuilder.Entity<GroupMember>().HasData(
                new GroupMember { Id = 1, GroupId = 1, UserId = 2, JoinedDate = DateTime.UtcNow },
                new GroupMember { Id = 2, GroupId = 1, UserId = 3, JoinedDate = DateTime.UtcNow },
                new GroupMember { Id = 3, GroupId = 2, UserId = 4, JoinedDate = DateTime.UtcNow }
            );
        }
    }
}
