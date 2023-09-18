const mongoose = require('mongoose')

const Schema = mongoose.Schema

const tableSchema = new Schema({
	number: {
		type: Number,
		required: true,
	},
  name: {
    type: String,
  }
})

module.exports = mongoose.model('Table', tableSchema)
