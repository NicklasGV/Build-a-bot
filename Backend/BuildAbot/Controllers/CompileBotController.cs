using Microsoft.AspNetCore.Mvc;
using System.IO.Compression;

namespace BuildAbot.Controllers
{
    public class BotScriptDto
    {
        public string FileName { get; set; }
        public string CodeLocationId { get; set; }
    }

    [ApiController]
    [Route("api/[controller]")]
    public class CompileBotController : ControllerBase
    {
        private readonly IHttpClientFactory _httpClientFactory;

        public CompileBotController(IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] List<BotScriptDto> scripts)
        {
            using var ms = new MemoryStream();
            using (var zip = new ZipArchive(ms, ZipArchiveMode.Create, true))
            {
                // requirements.txt
                var req = zip.CreateEntry("requirements.txt");
                using (var w = new StreamWriter(req.Open()))
                    w.WriteLine("discord.py>=2.0.0");

                // main.py
                var main = zip.CreateEntry("main.py");
                using (var w = new StreamWriter(main.Open()))
                {
                    w.WriteLine("import os");
                    w.WriteLine("import discord");
                    w.WriteLine("from discord.ext import commands\n");
                    w.WriteLine("bot = commands.Bot(command_prefix='!')\n");
                    w.WriteLine("for fname in os.listdir('./commands'):");
                    w.WriteLine("    if fname.endswith('.py'):");
                    w.WriteLine("        bot.load_extension(f'commands.{fname[:-3]}')\n");
                    w.WriteLine("@bot.event");
                    w.WriteLine("async def on_ready():");
                    w.WriteLine("    print(f'Logged in as {bot.user}')\n");
                    w.WriteLine("bot.run(os.getenv('BOT_TOKEN'))");
                }

                // commands/
                var client = _httpClientFactory.CreateClient();
                foreach (var script in scripts)
                {
                    // build URL to your simply.com files
                    var url = $"https://files.simply.com/Bot-Scripts/{script.CodeLocationId}";
                    var code = await client.GetStringAsync(url);

                    var entry = zip.CreateEntry($"commands/{script.FileName}");
                    using var w = new StreamWriter(entry.Open());
                    w.Write(code);
                }

                // .env.example
                var env = zip.CreateEntry(".env.example");
                using (var w = new StreamWriter(env.Open()))
                    w.WriteLine("BOT_TOKEN=your_bot_token_here");
            }

            ms.Position = 0;
            return File(ms.ToArray(),
                        "application/zip",
                        "discord-bot.zip");
        }
    }
}
