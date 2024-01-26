const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const businessSchema = new Schema({
  name: { type: String, required: true },
  address: { type: String },
  logo: { type: String },
  categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
  waiters: [{ type: Schema.Types.ObjectId, ref: 'Waiter' }],
  ownerId: { type: Schema.Types.ObjectId, ref: 'User' },
});

businessSchema.methods.addToWaiters = async function (userId) {
  this.waiters = [...this.waiters, userId];
  await this.save();
};

businessSchema.methods.removeFromWaiters = async function (userId) {
  this.waiters = [...this.waiters].filter((waiter) => waiter._id.toString() !== userId.toString());
  await this.save();
};

businessSchema.methods.addToCategories = async function (categoryId) {
  this.categories = [...this.categories, categoryId];
  await this.save();
};

businessSchema.methods.removeFromCategories = async function (categoryId) {
  let currentCategories = [...this.categories];
  currentCategories = currentCategories.filter(
    (category) => category._id.toString() !== categoryId,
  );
  this.categories = currentCategories;
  await this.save();
};

module.exports = mongoose.model('Business', businessSchema);
