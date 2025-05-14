export const environment = {
    production: true,
    apiUrl: 'https://api.buildabot.dk/api/',
    devApiUrl: 'https://buildabot.dk/',
    discord: {
        clientId:    '1364129896376569877',
        redirectUri: 'https://buildabot.dk/auth/discord/callback',
        scopes:      ['identify', 'email'],
        authorizeUrl:'https://discord.com/api/oauth2/authorize',
        tokenUrl:    'https://discord.com/api/oauth2/token',
        userApiUrl:  'https://discord.com/api/users/@me'
      }
};
