using BuildAbot.Interfaces.IStatus;

namespace BuildAbot.Repositories
{
    public class StatusRepository : IStatusRepository
    {
        private readonly DatabaseContext _databaseContext;
        private readonly IWebHostEnvironment _hostingEnvironment;
        private readonly AppSettings _appSettings;
        public StatusRepository(DatabaseContext databaseContext, IWebHostEnvironment hostingEnvironment, IOptions<AppSettings> appSettings)
        {
            _databaseContext = databaseContext;
            _hostingEnvironment = hostingEnvironment;
            _appSettings = appSettings.Value;
        }

        public async Task<Status> FindByIdAsync(int statusId)
        {
            return await _databaseContext.Status
                .FirstOrDefaultAsync(u => u.Id == statusId);
        }

        public async Task<Status> CreateAsync(Status newStatus)
        {
            _databaseContext.Status.Add(newStatus);
            await _databaseContext.SaveChangesAsync();
            newStatus = await FindByIdAsync(newStatus.Id);
            return newStatus;
        }
    }
}
