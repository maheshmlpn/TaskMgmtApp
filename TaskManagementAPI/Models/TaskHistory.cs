using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace TaskManagementAPI.Models
{
    public class TaskHistory
    {
        public int Id { get; set; }
        public int TaskId { get; set; }
        public int ChangedById { get; set; }

        [StringLength(100)]
        public string Field { get; set; }

        [StringLength(200)]
        public string OldValue { get; set; }

        [StringLength(200)]
        public string NewValue { get; set; }

        public DateTime ChangedDate { get; set; }

        // Navigation properties
        [ForeignKey("TaskId")]
        public virtual TaskItem Task { get; set; }

        [ForeignKey("ChangedById")]
        public virtual User ChangedBy { get; set; }
    }
}
