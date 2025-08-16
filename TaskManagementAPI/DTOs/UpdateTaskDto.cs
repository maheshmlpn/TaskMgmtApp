namespace TaskManagementAPI.DTOs
{
    public class UpdateTaskDto
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public string Priority { get; set; }
        public int? AssignedToId { get; set; }
        public DateTime? DueDate { get; set; }
        public int UpdatedById { get; set; }
    }
}
