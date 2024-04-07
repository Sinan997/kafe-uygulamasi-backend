const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const businessSchema = new Schema({
  name: { type: String, required: true },
  address: { type: String },
  logo: { type: String },
  categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
  waiters: [{ type: Schema.Types.ObjectId, ref: 'Waiter' }],
  ownerId: { type: Schema.Types.ObjectId, ref: 'User' },
  orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }],
});

businessSchema.methods.addToWaiters = async function (userId) {
  this.waiters = [...this.waiters, userId];
  await this.save();
};

businessSchema.methods.removeFromWaiters = async function (userId) {
  let currentWaiters = [...this.waiters];
  currentWaiters = currentWaiters.filter((waiter) => waiter._id.toString() !== userId.toString());
  this.waiters = currentWaiters;
  await this.save();
};

businessSchema.methods.addToCategories = async function (categoryId) {
  this.categories = [...this.categories, categoryId];
  await this.save();
};

businessSchema.methods.removeFromCategories = async function (categoryId) {
  let currentCategories = [...this.categories];
  currentCategories = currentCategories.filter(
    (category) => category._id.toString() !== categoryId.toString(),
  );
  this.categories = currentCategories;
  await this.save();
};

businessSchema.methods.addOrder = async function (orderIdList) {
  this.orders = [...this.orders, ...orderIdList];
  await this.save();
};

businessSchema.methods.removeOrders = async function (orderIds) {
  let currentOrders = [...this.orders];
  currentOrders = currentOrders.filter((order) => !orderIds.includes(order._id.toString()));
  this.orders = currentOrders;
  await this.save();
};

module.exports = mongoose.model('Business', businessSchema);
