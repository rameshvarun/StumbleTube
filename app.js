
//Import all libraries
var express = require('express');
var http = require('http');
var path = require('path');
var swig = require('swig');



var routes = require('./routes');

var app = express();

//Redis-stored session
var MemoryStore = express.session.MemoryStore;
var sessionStore = new MemoryStore();

var secret = 'art4aefdasvdfacszxzZDsar';

app.use(express.cookieParser(secret));
app.use(express.session( {store: sessionStore, key: 'express.sid'} ));

//All environments
app.set('port', process.env.PORT || 3000);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use( express.methodOverride() );



//Register Swig as template parser
app.engine('html', swig.renderFile);
app.set('views', __dirname + '/views');
app.set('view cache', false);
swig.setDefaults({ cache: false });

//Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

app.use(app.router);

var server = http.createServer(app);
var io = require('socket.io').listen(server);

//Start server
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

app.get('/', routes.index);
app.get('/oauth2callback', routes.oauth2callback);
app.get('/player', routes.player);
app.get('/logout', routes.logout);

var cookie = require('cookie');
var connect = require('connect');
var Session = require('connect').middleware.session.Session;

io.set('authorization', function (data, accept) {

   if (data.headers.cookie) {
        data.cookie = connect.utils.parseSignedCookies(cookie.parse(decodeURIComponent(data.headers.cookie)),secret);
        
		data.sessionID = data.cookie['express.sid'];
        // save the session store to the data object 
        // (as required by the Session constructor)
        data.sessionStore = sessionStore;
        sessionStore.get(data.sessionID, function (err, session) {
            if (err || !session) {
                accept('Error', false);
            } else {
                // create a session object, passing data as request and our
                // just acquired session data
                data.session = new Session(data, session);
                accept(null, true);
            }
        });
    } else {
       return accept('No cookie transmitted.', false);
    }
	
});

io.sockets.on('connection', routes.socket )

