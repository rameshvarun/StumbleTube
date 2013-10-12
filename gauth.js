var googleapis = require('googleapis');
OAuth2Client = googleapis.OAuth2Client;

//Google OAuth
var CLIENT_ID = '110889257420.apps.googleusercontent.com';
exports.CLIENT_ID = CLIENT_ID;

var CLIENT_SECRET = 'yH4Azb_hwLlawzKtbO_1y2tO';

var APP_URL = process.env.PORT || "http://localhost:3000/"
var REDIRECT_URL = APP_URL + 'oauth2callback';

oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);
exports.client = oauth2Client;

var scopes = "https://www.googleapis.com/auth/plus.me https://www.googleapis.com/auth/youtube";

exports.loginurl = oauth2Client.generateAuthUrl({
	  access_type: 'offline',
	  scope: scopes
	});