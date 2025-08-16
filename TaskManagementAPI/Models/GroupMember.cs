using System.ComponentModel.DataAnnotations.Schema;

namespace TaskManagementAPI.Models
{
    public class GroupMember
    {
        public int Id { get; set; }
        public int GroupId { get; set; }
        public int UserId { get; set; }
        public DateTime JoinedDate { get; set; }

        // Navigation properties
        [ForeignKey("GroupId")]
        public virtual Group Group { get; set; }

        [ForeignKey("UserId")]
        public virtual User User { get; set; }
    }
}
