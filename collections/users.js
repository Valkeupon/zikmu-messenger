var config = require('./collections');

var userDataSchema = config.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  archived: {
    type: Boolean,
    required: true,
    default: false
  },

}, {collection: 'users'});

var UserData = config.mongoose.model('UserData', userDataSchema);


module.exports = UserData;
