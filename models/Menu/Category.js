const mongoose = require('mongoose')

const Schema = mongoose.Schema

const categorySchema = new Schema({
	title: {
		type: String,
		required: true,
	},
	index: {
		type: Number,
		required: true,
	}
})

module.exports = mongoose.model('Category', categorySchema)
