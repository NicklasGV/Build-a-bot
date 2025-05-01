namespace BuildAbot.Interfaces.IStatus
{
    public interface IStatusRepository
    {
        Task<Status?> FindByIdAsync(int statusId);
        Task<Status> CreateAsync(Status newStatus);
    }
}
