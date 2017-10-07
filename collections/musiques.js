var config = require('./collections');

var style = [{
  type: String,
  required: false
}];

var groupes = {
  _id: String,
  name: String
};

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
    type: groupes,
    required: true
  },
  styles: {
    type: [style],
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
