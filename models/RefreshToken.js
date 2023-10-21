const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const RefreshTokenSchema = new Schema({
  token: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("RefreshToken", RefreshTokenSchema);
