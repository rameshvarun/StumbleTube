
//Import all libraries
var express = require('express');
var http = require('http');
var path = require('path');
var swig = require('swig');



var routes = require('./routes');

var app = express();

//All environments
app.set('port', process.env.PORT || 3000);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);

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

app.get('/', routes.index);

io.sockets.on('connection', function(socket)
{

	socket.emit('success', {});

	socket.on('getvideos', function(data){
		socket.emit('newvideos', {vid1: 'CMdHDHEuOUE',
									vid2: 'CMdHDHEuOUE',
									vid3: 'CMdHDHEuOUE',
									vid4: 'CMdHDHEuOUE'} );
	});
	
	socket.on('likevideo', function(data){
		
	});


} )

