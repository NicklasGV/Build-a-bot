namespace BuildAbot.Interfaces.IBot
{
    public interface IBotService
    {
        Task<List<BotResponse>> GetAllAsync();
        Task<BotResponse?> FindByIdAsync(int botId);
        Task<BotResponse?> CreateAsync(BotRequest botRequest);
        Task<BotResponse?> UpdateByIdAsync(int botId, BotRequest botRequest);
        Task<BotResponse?> DeleteByIdAsync(int botId);
    }
}
