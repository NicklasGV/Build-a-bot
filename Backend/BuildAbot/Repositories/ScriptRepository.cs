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
            newScript = await FindByIdAsync(newScript.Id);
            return newScript;
        }

        public async Task<Script> UpdateByIdAsync(int scriptId, Script updateScript)
        {
            Script script = await FindByIdAsync(scriptId);
            if (script != null)
            {
                script.UserId = updateScript.UserId;
                script.Title = updateScript.Title;
                script.Description = updateScript.Description;
                script.CodeLocationId = updateScript.CodeLocationId;
                script.GuideLocationId = updateScript.GuideLocationId;

                await _databaseContext.SaveChangesAsync();

                script = await FindByIdAsync(script.Id);
            }
            return script;
        }

        public async Task<Script> DeleteByIdAsync(int scriptId)
        {
            var script = await FindByIdAsync(scriptId);

            if (script != null)
            {
                _databaseContext.Remove(script);
                await _databaseContext.SaveChangesAsync();
            }
            return script;
        }

        public async Task<List<Script>> GetAllAsync()
        {
            return await _databaseContext.Script
                .Include(s => s.User)
                .ToListAsync();
        }
    }
}