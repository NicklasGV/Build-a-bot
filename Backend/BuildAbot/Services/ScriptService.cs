﻿namespace BuildAbot.Services
{
    public class ScriptService: IScriptService
    {
        private readonly IScriptRepository _scriptRepository;


        public ScriptService(IScriptRepository scriptRepository)
        {
            _scriptRepository = scriptRepository;
        }

        public static ScriptResponse MapScriptToScriptResponse(Script script)
        {
            ScriptResponse response = new ScriptResponse
            {
                Id = script.Id,
                Title = script.Title,
                Description = script.Description,
                CodeLocationId = script.CodeLocationId,
                GuideLocationId = script.GuideLocationId,
                User = script.User == null ? null : new UserScriptResponse
                {
                    Id = script.User.Id,
                    UserName = script.User.UserName,
                    Email = script.User.Email
                }

            };
            if (script.FavoriteScripts != null && script.FavoriteScripts.Count > 0)
            {
                response.Favorites = script.FavoriteScripts.Select(x => new FavoriteScriptResponse
                {
                    Id = x.User.Id,
                    Username = x.User.UserName
                }).ToList();
            }
            if (script.BotScripts != null && script.BotScripts.Count > 0)
            {
                response.BotScripts = script.BotScripts.Select(x => new BotScriptScriptsResponse
                {
                    Id = x.Bot.Id,
                    Name = x.Bot.Name
                }).ToList();
            }

            return response;
        }

        private static Script MapScriptRequestToScript(ScriptRequest scriptRequest)
        {
            Script script = new Script
            {
                UserId = scriptRequest.UserId,
                Title = scriptRequest.Title,
                Description = scriptRequest.Description,
                CodeLocationId = scriptRequest.CodeLocationId ?? string.Empty,
                GuideLocationId = scriptRequest.GuideLocationId ?? string.Empty,
                FavoriteScripts = scriptRequest.UserIds
                    .Where(x => x != 0)
                    .Select(x => new FavoriteScript { UserId = x })
                    .ToList(),
                BotScripts = scriptRequest.BotIds
                    .Where(x => x != 0)
                    .Select(x => new BotScript { BotId = x })
                    .ToList()
            };
            return script;
        }

        public async Task<List<ScriptResponse>> GetAllAsync()
        {
            List<Script> scripts = await _scriptRepository.GetAllAsync();

            if (scripts == null)
            {
                throw new ArgumentException();
            }
            return scripts.Select(MapScriptToScriptResponse).ToList();
        }

        public async Task<ScriptResponse> FindByIdAsync(int scriptId)
        {
            var script = await _scriptRepository.FindByIdAsync(scriptId);

            if (script != null)
            {
                return MapScriptToScriptResponse(script);
            }

            return null;
        }

        public async Task<ScriptResponse> CreateAsync(ScriptRequest newScript)
        {
            var script = await _scriptRepository.CreateAsync(MapScriptRequestToScript(newScript));
            if (script == null)
            {
                throw new ArgumentNullException();
            }
            return MapScriptToScriptResponse(script);
        }

        public async Task<ScriptResponse> UpdateByIdAsync(int scriptId, ScriptRequest updateScript)
        {
            var insertedScript = await _scriptRepository.UpdateByIdAsync(scriptId, MapScriptRequestToScript(updateScript));

            if (insertedScript != null)
            {
                return MapScriptToScriptResponse(insertedScript);
            }

            return null;
        }

        public async Task<ScriptResponse> DeleteByIdAsync(int scriptId)
        {
            var script = await _scriptRepository.DeleteByIdAsync(scriptId);

            if (script != null)
            {
                return MapScriptToScriptResponse(script);
            }
            return null;
        }

    }
}
