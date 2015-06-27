// globals
var globals = require('./globals');

//Import all libraries
var crypto = require('crypto');
var express = require('express');
var http = require('http');
var path = require('path');
var swig = require('swig');
var cookieSession = require('cookie-session');
var Cookies = require('cookies');
var bodyParser = require('body-parser');

var app = express();
app.use(cookieSession({ secret: COOKIE_SECRET }));

//All environments
app.set('port', PORT);
app.use(bodyParser());

//Register Swig as template parser
app.engine('html', swig.renderFile);
app.set('views', __dirname + '/views');
app.set('view cache', false);
swig.setDefaults({ cache: false });

//Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

var server = http.createServer(app);
var io = require('socket.io').listen(server);

//Start server
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

app.get('/', require('./routes/index'));
app.get('/oauth2callback', require('./routes/oauth2callback'));
app.get('/player', require('./routes/player'));

app.get('/logout', require('./routes/logout'));
app.get('/remote', require('./routes/remote'));

io.use(function (socket, next) {
    var cookies = new Cookies(socket.request, {
        getHeader: function() { },
        setHeader: function() { }
      }, [COOKIE_SECRET]);
    var encoded = cookies.get('express:sess', { signed: true });
    socket.sessionID = crypto.randomBytes(10).toString('hex');

    if(encoded) {
    	var buffer = new Buffer(encoded, 'base64').toString('utf8');
      socket.session = JSON.parse(buffer);
    	if(socket.session) next();
    	else new Error('Authentication error');
    } else new Error('No cookie transmitted');
});

io.sockets.on('connection', require('./routes/socket'))
