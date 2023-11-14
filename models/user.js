const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
  },
  surname: {
    type: String,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  businessId: {
    type: Schema.Types.ObjectId,
    ref: 'Business',
  },
});

module.exports = mongoose.model('User', userSchema);
