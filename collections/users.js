var config = require('./collections');

var musics = [{
  musicId: String,
  like: Boolean,
  sendAt: {
    type: Date,
    default: new Date()
  }
}];

var styles = [{
  styleId: String,
  archived: {
    type: Boolean,
    default: false,
    required: false
  }
}];

var userDataSchema = config.Schema({
  messengerId: {
    type: String,
    required: false
  },
  firstName: {
    type: String,
    required: false
  },
  lastName: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  picture: {
    type: String,
    required: true
  },
  status: {
    type: String,
	  default: "admin"
  },
  musicPlayed: {
    type: [musics],
    required: false,
  },
  actif: {
    type: String,
    required: true,
    default: true
  },
  recurrence: {
    type: String,
    required: false,
  },
  choiceOfStyle: {
    type: [styles],
    required: false,
  },
  profileImg: {
    type: String,
    required: false,
  },
  archived: {
    type: Boolean,
    required: true,
    default: false
  }
}, {collection: 'users'});

var UserData = config.mongoose.model('UserData', userDataSchema);


module.exports = UserData;
