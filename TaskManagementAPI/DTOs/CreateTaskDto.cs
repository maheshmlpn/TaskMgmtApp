namespace TaskManagementAPI.DTOs
{
    public class CreateTaskDto
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public string Priority { get; set; } = "Medium";
        public int CreatedById { get; set; }
        public int GroupId { get; set; }
        public DateTime? DueDate { get; set; }
    }
}
