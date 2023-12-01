const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const categorySchema = new Schema({
  name: { type: String, required: true },
  index: { type: Number, required: true },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
});

categorySchema.methods.addToProducts = async function (userId) {
  const currentProducts = this.products;
  currentProducts.push(userId);
  this.users = currentProducts;
  await this.save();
};

categorySchema.methods.removeFromProducts = async function (productId) {
  let currentProducts = [...this.products];
  currentProducts = currentProducts.filter((product) => product._id.toString() !== productId);
  this.products = currentProducts;
  await this.save();
};

module.exports = mongoose.model('Category', categorySchema);
