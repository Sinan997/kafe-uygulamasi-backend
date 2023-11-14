const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const businessSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

businessSchema.methods.addToUsers = async function (userId) {
  const currentUsers = this.users;
  currentUsers.push(userId);
  this.users = currentUsers;
  await this.save();
};

module.exports = mongoose.model('Business', businessSchema);
