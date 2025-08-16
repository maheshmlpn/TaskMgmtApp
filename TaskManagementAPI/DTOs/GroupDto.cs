namespace TaskManagementAPI.DTOs
{
    public class GroupDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int OwnerId { get; set; }
        public string OwnerName { get; set; }
        public List<UserDto> Members { get; set; } = new List<UserDto>();
    }
}
