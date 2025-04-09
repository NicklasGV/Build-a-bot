namespace BuildAbot.Interfaces.IScript
{
    public interface IScriptService
    {
        Task<ScriptResponse?> FindByIdAsync(int scriptId);
        Task<ScriptResponse> CreateAsync(ScriptRequest newScript);
        Task<ScriptResponse?> UpdateByIdAsync(int scriptId, ScriptRequest updateScript);
        Task<ScriptResponse> DeleteByIdAsync(int scriptId);
        Task<List<ScriptResponse>> GetAllAsync();
    }
}
