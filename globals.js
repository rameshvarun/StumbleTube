// Configuration variables
global.PORT = process.env.PORT || 3000;
global.APP_URL = process.env.URL || "http://localhost:" + exports.PORT + "/";
global.API_KEY = process.env.API_KEY;
global.COOKIE_SECRET = process.env.COOKIE_SECRET;
global.CLIENT_ID = process.env.CLIENT_ID;
global.CLIENT_SECRET = process.env.CLIENT_SECRET;

// The URL to redirect to on OAuthCallback
global.REDIRECT_URL = APP_URL + 'oauth2callback';

// Google APIs
global.google = require('googleapis');
global.youtube = google.youtube('v3');
global.OAuth2 = google.auth.OAuth2;
global.oauth2Client = new OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);

global.GAUTH_URL = oauth2Client.generateAuthUrl({
  access_type: 'online',
  scope: ["https://www.googleapis.com/auth/plus.me", "https://www.googleapis.com/auth/youtube"]
});
