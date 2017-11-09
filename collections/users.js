var config = require('./collections');

var musics = [{
  musicId: {
    type: String,
    required: false
  },
  like:{
    type: Boolean,
    required: false
  },
  sendAt: {
    type: Date,
    default: new Date(),
    required: false
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
    required: false
  },
  password: {
    type: String,
    required: false
  },
  picture: {
    type: String,
    required: false
  },
  status: {
    type: String,
	  default: "admin",
    required: false
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
