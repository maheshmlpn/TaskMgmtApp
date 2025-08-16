using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace TaskManagementAPI.Models
{
    public class Group
    {
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [StringLength(500)]
        public string Description { get; set; }

        public int OwnerId { get; set; }
        public DateTime CreatedDate { get; set; }

        // Navigation properties
        [ForeignKey("OwnerId")]
        public virtual User Owner { get; set; }
        public virtual ICollection<GroupMember> Members { get; set; }
        public virtual ICollection<TaskItem> Tasks { get; set; }
    }
}
