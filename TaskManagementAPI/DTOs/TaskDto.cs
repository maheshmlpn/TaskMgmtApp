namespace TaskManagementAPI.DTOs
{
    public class TaskDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Status { get; set; }
        public string Priority { get; set; }
        public int CreatedById { get; set; }
        public string CreatedByName { get; set; }
        public int? AssignedToId { get; set; }
        public string AssignedToName { get; set; }
        public int GroupId { get; set; }
        public string GroupName { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? DueDate { get; set; }
        public DateTime? CompletedDate { get; set; }
        public DateTime LastUpdated { get; set; }
        public List<TaskCommentDto> Comments { get; set; } = new List<TaskCommentDto>();
    }
}
