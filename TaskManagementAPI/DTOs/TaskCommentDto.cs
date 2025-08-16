namespace TaskManagementAPI.DTOs
{
    public class TaskCommentDto
    {
        public int Id { get; set; }
        public string Comment { get; set; }
        public string UserName { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
