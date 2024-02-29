const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const tableSchema = new Schema({
  name: { type: String, required: true },
  orders: [
    {
      productId: { type: Schema.Types.ObjectId, ref: 'Product' },
      amount: { type: Number, required: true, default: 1 },
    },
  ],
  businessId: { type: Schema.Types.ObjectId, ref: 'Business' },
});

module.exports = mongoose.model('Table', tableSchema);
