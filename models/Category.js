const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const categorySchema = new Schema({
  name: { type: String, required: true },
  index: { type: Number, required: true },
  businessId: { type: mongoose.Schema.Types.ObjectId, required: true },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  photoUrl: { type: String },
});

categorySchema.methods.addToProducts = async function (productId) {
  this.products = [...this.products, productId];
  await this.save();
};

categorySchema.methods.removeFromProducts = async function (productId) {
  let currentProducts = [...this.products];
  currentProducts = currentProducts.filter((product) => product._id.toString() !== productId);
  this.products = currentProducts;
  await this.save();
};

module.exports = mongoose.model('Category', categorySchema);
