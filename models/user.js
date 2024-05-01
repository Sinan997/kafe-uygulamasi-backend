const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  businessId: { type: Schema.Types.ObjectId, ref: 'Business' },
  notifications: [{ type: Schema.Types.ObjectId, ref: 'Notification' }],
});

module.exports = mongoose.model('User', userSchema);
