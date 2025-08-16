using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace TaskManagementAPI.Models
{
    public class TaskComment
    {
        public int Id { get; set; }
        public int TaskId { get; set; }
        public int UserId { get; set; }

        [Required]
        [StringLength(1000)]
        public string Comment { get; set; }

        public DateTime CreatedDate { get; set; }

        // Navigation properties
        [ForeignKey("TaskId")]
        public virtual TaskItem Task { get; set; }

        [ForeignKey("UserId")]
        public virtual User User { get; set; }
    }
}
