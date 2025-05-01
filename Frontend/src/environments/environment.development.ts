export const environment = {
    production: false,
    apiUrl: 'http://localhost:5132/api/',
    fileServerUrl: 'https://nt36.unoeuro.com',
    fileServerUser: 'buildabot.dk',
    fileServerPass: 'kx2nGdr39ztafwmge4AF',
    discord: {
        clientId:    '1364129896376569877',
        redirectUri: 'http://localhost:4200/auth/callback',
        scopes:      ['identify', 'email'],
        authorizeUrl:'https://discord.com/api/oauth2/authorize',
        tokenUrl:    'https://discord.com/api/oauth2/token',
        userApiUrl:  'https://discord.com/api/users/@me'
      }
};
