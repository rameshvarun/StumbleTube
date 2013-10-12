var mongoose = require('mongoose');

var uristring = 
process.env.MONGOLAB_URI || 
process.env.MONGOHQ_URL || 
'mongodb://localhost/stumbletube';

mongoose.connect( uristring );

var db = mongoose.connection;
db.once('open', function callback () {
        console.log('Successfully connected to MongoDB.');
});

exports.mongoose = mongoose;