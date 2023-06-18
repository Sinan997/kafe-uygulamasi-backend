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
	},
	products: {
		type: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }
    ],
	},
})

module.exports = mongoose.model('Category', categorySchema)
