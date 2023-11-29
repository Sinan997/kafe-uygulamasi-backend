const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const businessSchema = new Schema({
  name: { type: String, required: true },
  categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
  products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  users: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
});

businessSchema.methods.addToUsers = async function (userId) {
  const currentUsers = this.users;
  currentUsers.push(userId);
  this.users = currentUsers;
  await this.save();
};

module.exports = mongoose.model('Business', businessSchema);
