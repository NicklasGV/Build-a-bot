namespace BuildAbot.Interfaces.IBot
{
    public interface IBotRepository
    {
        Task<List<Bot>> GetAllAsync();
        Task<Bot?> FindByIdAsync(int botId);
        Task<Bot> CreateAsync(Bot newBot);
        Task<Bot> UpdateByIdAsync(int botId, Bot updateBot);
        Task<Bot?> DeleteByIdAsync(int botId);
    }
}
