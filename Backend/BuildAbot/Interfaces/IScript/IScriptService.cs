namespace BuildAbot.Interfaces.IScript
{
    public interface IScriptService
    {
        Task<ScriptResponse?> FindByIdAsync(int scriptId);
        Task<ScriptResponse> CreateAsync(ScriptRequest newScript);
    }
}
