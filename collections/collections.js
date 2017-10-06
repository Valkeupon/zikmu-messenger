var mongoose = require('mongoose');
mongoose.connect('localhost:27017/test');

var Schema = mongoose.Schema;


module.exports = { Schema, mongoose };
