const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product' },
  businessId: { type: Schema.Types.ObjectId, ref: 'Business' },
  amount: { type: Number, required: true },
});

module.exports = mongoose.model('Table', orderSchema);
