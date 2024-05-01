const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const notificationSchema = new Schema({
  tableName: { type: String, required: true },
  productName: { type: String, required: true },
  quantity: { type: Number, required: true },
  isRead: { type: Boolean },
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
});

module.exports = mongoose.model('Notification', notificationSchema);
