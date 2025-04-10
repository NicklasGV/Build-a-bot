namespace BuildAbot.Repositories
{
    public class BotRepository : IBotRepository
    {
        private readonly DatabaseContext _databaseContext;
        private readonly IWebHostEnvironment _hostingEnvironment;
        public BotRepository(DatabaseContext databaseContext, IWebHostEnvironment hostingEnvironment)
        {
            _databaseContext = databaseContext;
            _hostingEnvironment = hostingEnvironment;
        }

        public async Task<List<Bot>> GetAllAsync()
        {
            return await _databaseContext.Bot
                .Include(b => b.User)
                .Include(b => b.BotScripts)
                .ThenInclude(bs => bs.Script)
                .ToListAsync();
        }

        public async Task<Bot> FindByIdAsync(int botId)
        {
            return await _databaseContext.Bot
                .Include(b => b.User)
                .Include(b => b.BotScripts)
                .ThenInclude(bs => bs.Script)
                .FirstOrDefaultAsync(s => s.Id == botId);
        }

        public async Task<Bot> CreateAsync(Bot newBot)
        {
            _databaseContext.Bot.Add(newBot);
            await _databaseContext.SaveChangesAsync();
            newBot = await FindByIdAsync(newBot.Id);
            return newBot;
        }

        public async Task<Bot> UpdateByIdAsync(int botId, Bot updateBot)
        {
            Bot bot = await FindByIdAsync(botId);
            if (bot != null)
            {
                bot.UserId = updateBot.UserId;
                bot.Name = updateBot.Name;
                bot.BotScripts = updateBot.BotScripts;
                await _databaseContext.SaveChangesAsync();
                bot = await FindByIdAsync(bot.Id);
            }
            return bot;
        }

        public async Task<Bot> DeleteByIdAsync(int botId)
        {
            var bot = await FindByIdAsync(botId);
            if (bot != null)
            {
                _databaseContext.Bot.Remove(bot);
                await _databaseContext.SaveChangesAsync();
            }
            return bot;
        }
    }
}
