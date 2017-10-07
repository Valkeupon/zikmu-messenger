var config = require('./collections');


var styleDataSchema = config.Schema({
  title: {
    type: String,
    required: true
  },
  archived: {
    type: Boolean,
    required: true,
    default: false
  }
}, {collection: 'styles'});

var StyleData = config.mongoose.model('StyleData', styleDataSchema);


module.exports = StyleData;
