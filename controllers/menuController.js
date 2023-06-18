const Category = require('../models/Menu/Category')

const addCategory = async (req, res) => {
	const { title, index } = req.body
	let isIndexAvailable
	console.log(title,index);

	if(!title || !(typeof index === 'number' || index)){
		return res.status(406).json({ message: 'Gerekli Alanları Doldurunuz', success: false })
	}

	isIndexAvailable = await Category.findOne({ index })

	if(isIndexAvailable){
		return res.status(406).json({ message: 'Kategori Oluşturulurken Teknik Hata', success: false })
	}

	const newCategory = new Category({title,index})
	
	try {
		await newCategory.save()
		return res.status(201).json({ message: 'Kategori Oluşturuldu', success: true, category: newCategory})
	} catch (error) {
		console.log(error);
		return res.status(404).json({ message: 'Kategori oluşturulamadı', success: false })
	}
}

const allCategories = async (req,res) => {
	try {
		const categories = await Category.find()
		return res.status(200).json({ success: true, categories})
	} catch (error) {
		console.log(error);
		return res.status(404).json({ message: 'Kategoriler Getirilemedi', success: false })
	}
}

module.exports = {
	addCategory,
	allCategories
}

