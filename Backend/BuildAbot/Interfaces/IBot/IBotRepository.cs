namespace BuildAbot.Interfaces.IBot
{
    public interface IBotRepository
    {
        Task<List<Bot>> GetAllAsync();
        Task<Bot?> FindByIdAsync(int botId);
    }
}
