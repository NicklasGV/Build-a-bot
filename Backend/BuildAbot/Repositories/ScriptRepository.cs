namespace BuildAbot.Repositories
{
    public class ScriptRepository : IScriptRepository
    {
        private readonly DatabaseContext _databaseContext;
        private readonly IWebHostEnvironment _hostingEnvironment;
        public ScriptRepository(DatabaseContext databaseContext, IWebHostEnvironment hostingEnvironment)
        {
            _databaseContext = databaseContext;
            _hostingEnvironment = hostingEnvironment;
        }

        public async Task<Script> FindByIdAsync(int scriptId)
        {
            return await _databaseContext.Script
                .Include(s => s.User)
                .FirstOrDefaultAsync(s => s.Id == scriptId);
        }

        public async Task<Script> CreateAsync(Script newScript)
        {
            _databaseContext.Script.Add(newScript);
            await _databaseContext.SaveChangesAsync();
            return newScript;
        }
    }
}