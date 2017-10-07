var config = require('./collections');


var bandDataSchema = config.Schema({
  title: {
    type: String,
    required: true
  },
  createdAt:{
    type: Date,
    default: new Date()
  },
  archived: {
    type: Boolean,
    required: true,
    default: false
  }
}, {collection: 'groupes'});

var BandData = config.mongoose.model('BandData', bandDataSchema);


module.exports = BandData;
