namespace BuildAbot.Interfaces.IScript
{
    public interface IScriptRepository
    {
        Task<Script?> FindByIdAsync(int scriptId);
        Task<Script> CreateAsync(Script newScript);
        Task<Script?> UpdateByIdAsync(int scriptId, Script updateScript);
        Task<Script?> DeleteByIdAsync(int scriptId);
        Task<List<Script>> GetAllAsync();
        Task<Script> UploadScriptFile(int scriptId, IFormFile file);
        Task<Script> UploadGuideFile(int scriptId, IFormFile file);
    }
}
