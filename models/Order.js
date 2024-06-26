const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product' },
  tableId: { type: Schema.Types.ObjectId, ref: 'Table' },
  businessId: { type: Schema.Types.ObjectId, ref: 'Business' },
  baseAmount: { type: Number, required: true },
  amount: { type: Number, required: true },
  isReady: { type: Boolean, default: false },
  isDelivered: { type: Boolean, default: false },
});

module.exports = mongoose.model('Order', orderSchema);
