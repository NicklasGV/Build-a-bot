namespace BuildAbot.Services
{
    public class BotService : IBotService
    {
        private readonly IBotRepository _botRepository;


        public BotService(IBotRepository botRepository)
        {
            _botRepository = botRepository;
        }

        public static BotResponse MapBotToBotResponse(Bot bot)
        {
            BotResponse response = new BotResponse
            {
                Id = bot.Id,
                Name = bot.Name,
                User = bot.User == null ? null : new UserBotResponse
                {
                    Id = bot.User.Id,
                    UserName = bot.User.UserName,
                    Email = bot.User.Email
                }

            };
                if (bot.BotScripts != null && bot.BotScripts.Count > 0)
                {
                response.BotScripts = bot.BotScripts.Select(x => new BotScriptResponse
                {
                    Id = x.Script.Id,
                    Title = x.Script.Title,
                    CodeLocationId = x.Script.CodeLocationId,
                    GuideLocationId = x.Script.GuideLocationId
                }).ToList();
            }

            return response;
        }

        private static Bot MapBotRequestToBot(BotRequest botRequest)
        {
            Bot bot = new Bot
            {
                UserId = botRequest.UserId,
                Name = botRequest.Name,
                BotScripts = botRequest.ScriptIds?.Select(x => new BotScript
                {
                    ScriptId = x
                }).ToList() ?? new List<BotScript>()
            };
            return bot;
        }

        public async Task<List<BotResponse>> GetAllAsync()
        {
            List<Bot> bots = await _botRepository.GetAllAsync();

            if (bots == null)
            {
                throw new ArgumentException();
            }
            return bots.Select(MapBotToBotResponse).ToList();
        }

        public async Task<BotResponse> FindByIdAsync(int botId)
        {
            var bot = await _botRepository.FindByIdAsync(botId);

            if (bot != null)
            {
                return MapBotToBotResponse(bot);
            }

            return null;
        }

        public async Task<BotResponse> CreateAsync(BotRequest botRequest)
        {
            Bot bot = MapBotRequestToBot(botRequest);
            bot = await _botRepository.CreateAsync(bot);
            if (bot != null)
            {
                return MapBotToBotResponse(bot);
            }
            return null;
        }

        public async Task<BotResponse> UpdateByIdAsync(int botId, BotRequest botRequest)
        {
            Bot bot = MapBotRequestToBot(botRequest);
            bot = await _botRepository.UpdateByIdAsync(botId, bot);
            if (bot != null)
            {
                return MapBotToBotResponse(bot);
            }
            return null;
        }

        public async Task<BotResponse> DeleteByIdAsync(int botId)
        {
            var bot = await _botRepository.DeleteByIdAsync(botId);
            if (bot != null)
            {
                return MapBotToBotResponse(bot);
            }
            return null;
        }
    }
}
