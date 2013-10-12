var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/stumbletube');

var db = mongoose.connection;
db.once('open', function callback () {
        console.log('Successfully connected to MongoDB.');
});

exports.mongoose = mongoose;