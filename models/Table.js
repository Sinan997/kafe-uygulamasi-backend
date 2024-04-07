const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const tableSchema = new Schema({
  name: { type: String, required: true },
  orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }],
  businessId: { type: Schema.Types.ObjectId, ref: 'Business' },
});

module.exports = mongoose.model('Table', tableSchema);
