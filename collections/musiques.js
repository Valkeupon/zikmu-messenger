var config = require('./collections');

var musicDataSchema = config.Schema({
  title: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  style: {
    type: String,
    required: true
  },
  archived: {
    type: Boolean,
    required: true,
    default: false
  },
}, {collection: 'musics'});

var MusicData = config.mongoose.model('Musics', musicDataSchema);


module.exports = MusicData;
