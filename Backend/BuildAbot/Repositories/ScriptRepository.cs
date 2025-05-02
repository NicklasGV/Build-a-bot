using BuildAbot.Database.Entities;
using BuildAbot.Helper;
using BuildAbot.Interfaces.IStatus;

namespace BuildAbot.Repositories
{
    public class ScriptRepository : IScriptRepository
    {
        private readonly IStatusRepository _statusRepository;
        private readonly DatabaseContext _databaseContext;
        private readonly IWebHostEnvironment _hostingEnvironment;
        private readonly AppSettings _appSettings;
        public ScriptRepository(DatabaseContext databaseContext, IStatusRepository statusRepository ,IWebHostEnvironment hostingEnvironment, IOptions<AppSettings> appSettings)
        {
            _statusRepository = statusRepository;
            _databaseContext = databaseContext;
            _hostingEnvironment = hostingEnvironment;
            _appSettings = appSettings.Value;
        }

        public async Task<List<Script>> GetAllAsync()
        {
            return await _databaseContext.Script
                .Include(s => s.User)
                .Include(s => s.FavoriteScripts)
                .ThenInclude(f => f.User)
                .Include(s => s.BotScripts)
                .ThenInclude(bs => bs.Bot)
                .Include(s => s.Status)
                .ToListAsync();
        }

        public async Task<Script> FindByIdAsync(int scriptId)
        {
            return await _databaseContext.Script
                .Include(s => s.User)
                .Include(s => s.FavoriteScripts)
                .ThenInclude(f => f.User)
                .Include(s => s.BotScripts)
                .ThenInclude(bs => bs.Bot)
                .Include(s => s.Status)
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
                script.FavoriteScripts = updateScript.FavoriteScripts;
                if (script.StatusId != updateScript.StatusId)
                {
                    await _statusRepository.DeleteByIdAsync(script.StatusId);
                    script.StatusId = updateScript.StatusId;

                }

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

        public async Task<Script?> UploadScriptFile(int scriptId, IFormFile file)
        {
            Script script = await FindByIdAsync(scriptId);

            // Base FTP URL (up to public_html)
            string baseFtp = _appSettings.FTPBase + "/public_html";
            // The relative folder we want to end up in
            string remoteFolder = $"assets/uploads/{script.UserId}/{script.Id}";


            await EnsureFtpDirectoryExists(baseFtp, remoteFolder);

            // Delete old file if present
            if (!string.IsNullOrEmpty(script.CodeLocationId))
            {
                await DeleteFileOnFtpAsync(script.CodeLocationId);
            }

            // Build final URI for upload
            string fileName = Guid.NewGuid() + Path.GetExtension(file.FileName);
            Uri uploadUri = new Uri($"{baseFtp}/{remoteFolder}/{fileName}");

            var uploadRequest = (FtpWebRequest)WebRequest.Create(uploadUri);
            uploadRequest.Method = WebRequestMethods.Ftp.UploadFile;

            using (var fileStream = file.OpenReadStream())
            using (var ftpStream = uploadRequest.GetRequestStream())
                await fileStream.CopyToAsync(ftpStream);

            // Update DB
            script.CodeLocationId = Path.Combine("assets/uploads/" + script.UserId + "/" + script.Id + "/", fileName);
            await UpdateByIdAsync(scriptId, script);

            return script;
        }



        public async Task<Script?> UploadGuideFile(int scriptId, IFormFile file)
        {
            Script script = await FindByIdAsync(scriptId);

            string baseFtp = _appSettings.FTPBase + "/public_html";
            string remoteFolder = $"assets/uploads/{script.UserId}/{script.Id}";


            await EnsureFtpDirectoryExists(baseFtp, remoteFolder);

            // Delete old file if present
            if (!string.IsNullOrEmpty(script.GuideLocationId))
            {
                await DeleteFileOnFtpAsync(script.GuideLocationId);
            }

            // Build final URI for upload
            string fileName = Guid.NewGuid() + Path.GetExtension(file.FileName);
            Uri uploadUri = new Uri($"{baseFtp}/{remoteFolder}/{fileName}");

            var uploadRequest = (FtpWebRequest)WebRequest.Create(uploadUri);
            uploadRequest.Method = WebRequestMethods.Ftp.UploadFile;

            using (var fileStream = file.OpenReadStream())
            using (var ftpStream = uploadRequest.GetRequestStream())
                await fileStream.CopyToAsync(ftpStream);

            // Update DB
            script.GuideLocationId = Path.Combine("assets/uploads/" + script.UserId + "/" + script.Id + "/", fileName);
            await UpdateByIdAsync(scriptId, script);

            return script;
        }

        private async Task EnsureFtpDirectoryExists(string baseFtpUrl, string relativePath)
        {
            var segments = relativePath.Split(new[] { '/' }, StringSplitOptions.RemoveEmptyEntries);
            string currentPath = baseFtpUrl.TrimEnd('/');

            foreach (var seg in segments)
            {
                currentPath += "/" + seg;
                var uri = new Uri(currentPath);

                var mkdir = (FtpWebRequest)WebRequest.Create(uri);
                mkdir.Method = WebRequestMethods.Ftp.MakeDirectory;

                try
                {
                    using var resp = (FtpWebResponse)await mkdir.GetResponseAsync();
                }
                catch (WebException ex)
                {
                    if (ex.Response is FtpWebResponse ftpResp &&
                        ftpResp.StatusCode == FtpStatusCode.ActionNotTakenFileUnavailable)
                    {
                        // 550: directory already exists — safe to ignore
                        continue;
                    }
                    throw; // something else went wrong
                }
            }
        }

        public async Task DeleteFileOnFtpAsync(string filePath)
        {
            string ftpUrl = _appSettings.FTPBase + "/public_html/";
            FtpWebRequest ftpRequest = (FtpWebRequest)WebRequest.Create(new Uri(new Uri(ftpUrl), filePath));
            ftpRequest.Method = WebRequestMethods.Ftp.DeleteFile;

            try
            {
                FtpWebResponse ftpResponse = (FtpWebResponse)await ftpRequest.GetResponseAsync();
                Console.WriteLine($"File deleted, status: {ftpResponse.StatusDescription}");
                ftpResponse.Close();
            }
            catch (WebException ex)
            {
                Console.WriteLine($"Error deleting file: {ex.Message}");
            }
        }

        public async Task DeleteFolderOnFtpAsync(int id, int userid)
        {
            string ftpUrl = $"{_appSettings.FTPBase}/public_html/assets/uploads/{userid}/{id}";

            FtpWebRequest ftpRequest = (FtpWebRequest)WebRequest.Create(new Uri(ftpUrl));
            ftpRequest.Method = WebRequestMethods.Ftp.RemoveDirectory;

            try
            {
                FtpWebResponse ftpResponse = (FtpWebResponse)await ftpRequest.GetResponseAsync();
                Console.WriteLine($"Folder deleted, status: {ftpResponse.StatusDescription}");
                ftpResponse.Close();
            }
            catch (WebException ex)
            {
                Console.WriteLine($"Error deleting folder on {ftpUrl}: {ex.Message}");
            }
        }
    }
}