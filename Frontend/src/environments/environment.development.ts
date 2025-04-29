export const environment = {
    production: false,
    apiUrl: 'http://localhost:5132/api/',
    discord: {
        clientId:    '1364129896376569877',
        redirectUri: 'http://localhost:4200/auth/callback',
        scopes:      ['identify', 'email'],
        authorizeUrl:'https://discord.com/api/oauth2/authorize',
        tokenUrl:    'https://discord.com/api/oauth2/token',
        userApiUrl:  'https://discord.com/api/users/@me'
      }
};
