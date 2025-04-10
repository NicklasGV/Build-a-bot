namespace BuildAbot.Interfaces.IBot
{
    public interface IBotService
    {
        Task<List<BotResponse>> GetAllAsync();
        Task<BotResponse?> FindByIdAsync(int botId);
    }
}
