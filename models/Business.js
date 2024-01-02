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

businessSchema.methods.addToUsers = async function (userId) {
  const currentUsers = this.users;
  currentUsers.push(userId);
  this.users = currentUsers;
  await this.save();
};

businessSchema.methods.addToCategories = async function (categoryId) {
  const currentCategories = this.categories;
  currentCategories.push(categoryId);
  this.categories = currentCategories;
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
