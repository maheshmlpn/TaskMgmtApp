using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

namespace TaskManagementAPI.Models
{
    public class User
    {
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [Required]
        [StringLength(100)]
        public string Email { get; set; }

        [StringLength(50)]
        public string Role { get; set; } // Admin, Manager, User

        public DateTime CreatedDate { get; set; }

        // Navigation properties
        public virtual ICollection<GroupMember> GroupMemberships { get; set; }
        public virtual ICollection<TaskItem> AssignedTasks { get; set; }
        public virtual ICollection<TaskItem> CreatedTasks { get; set; }
        public virtual ICollection<Group> OwnedGroups { get; set; }
    }
}
