/*var mongoose = require('mongoose');

var uristring = 
process.env.MONGOLAB_URI || 
process.env.MONGOHQ_URL || 
'mongodb://localhost/stumbletube';

mongoose.connect( uristring );

var db = mongoose.connection;
db.once('open', function callback () {
        console.log('Successfully connected to MongoDB.');
});

exports.mongoose = mongoose;*/

if (process.env.REDISTOGO_URL) {
	var rtg = require("url").parse(process.env.REDISTOGO_URL);
	var redis = require("redis").createClient(rtg.port, rtg.hostname);
	redis.auth(rtg.auth.split(":")[1]); 
} else {
	var redis = require("redis").createClient();
}

exports.redis = redis;