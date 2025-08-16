using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace TaskManagementAPI.Models
{
    public class TaskItem
    {
        public int Id { get; set; }

        [Required]
        [StringLength(200)]
        public string Title { get; set; }

        [StringLength(1000)]
        public string Description { get; set; }

        public TaskStatus Status { get; set; } = TaskStatus.Open;
        public Priority Priority { get; set; } = Priority.Medium;

        public int CreatedById { get; set; }
        public int? AssignedToId { get; set; }
        public int GroupId { get; set; }

        public DateTime CreatedDate { get; set; }
        public DateTime? DueDate { get; set; }
        public DateTime? CompletedDate { get; set; }
        public DateTime LastUpdated { get; set; }

        // Navigation properties
        [ForeignKey("CreatedById")]
        public virtual User CreatedBy { get; set; }

        [ForeignKey("AssignedToId")]
        public virtual User AssignedTo { get; set; }

        [ForeignKey("GroupId")]
        public virtual Group Group { get; set; }

        public virtual ICollection<TaskComment> Comments { get; set; }
        public virtual ICollection<TaskHistory> History { get; set; }
    }
}
