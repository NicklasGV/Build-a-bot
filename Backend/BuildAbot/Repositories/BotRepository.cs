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
    }
}
