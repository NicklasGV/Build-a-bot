namespace BuildAbot.Interfaces.IScript
{
    public interface IScriptRepository
    {
        Task<Script?> FindByIdAsync(int scriptId);
        Task<Script> CreateAsync(Script newScript);
    }
}
