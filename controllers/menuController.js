const Category = require('../models/Menu/Category')
const Product = require('../models/Menu/Product')

const addCategory = async (req, res) => {
	const { title, index } = req.body
	let isIndexAvailable
	let isTitleAvailable

	if (!title || !(typeof index === 'number' || index)) {
		return res.status(406).json({ message: 'Gerekli Alanları Doldurunuz', success: false })
	}

	isTitleAvailable = await Category.findOne({ title })

	if (isTitleAvailable) {
		return res.status(406).json({ message: 'Bu İsimde Kategori Bulunmakta', success: false })
	}

	isIndexAvailable = await Category.findOne({ index })

	if (isIndexAvailable) {
		return res.status(406).json({ message: 'Kategori Oluşturulurken Teknik Hata', success: false })
	}

	const newCategory = new Category({ title, index })

	try {
		await newCategory.save()
		return res.status(201).json({ message: 'Kategori Oluşturuldu', success: true, category: newCategory })
	} catch (error) {
		console.log(error)
		return res.status(404).json({ message: 'Kategori oluşturulamadı', success: false })
	}
}

const allCategories = async (req, res) => {
	try {
		const categories = await Category.find()
		return res.status(200).json({ success: true, categories })
	} catch (error) {
		console.log(error)
		return res.status(404).json({ message: 'Kategoriler Getirilemedi', success: false })
	}
}

const deleteCategory = async (req, res) => {
	const { id } = req.body
	if (!id) {
		return res.status(406).json({ message: 'Kategori Silinirken Teknik Hata', success: false })
	}

	try {
		const isDeleted = await Category.findByIdAndDelete(id)
		if (isDeleted) {
			return res.status(200).json({ message: 'Kategori Başarıyla Silindi', success: true })
		}
	} catch (error) {
		console.log(error)
		return res.status(404).json({ message: 'Kategori silinemedi', success: false })
	}
}

const setCategoriesIndex = async (req, res) => {
	const { categories } = req.body
	const promises = []
	if (!categories) {
		return res.status(406).json({ message: 'Kategoriler Güncellenirken Teknik Hata', success: false })
	}
	categories.forEach((category) => {
		promises.push(updateCategory(category))
	})

	try {
		Promise.all(promises).then((response) => {
			return res.status(200).json({ message: 'Kategoriler güncellendi', success: true })
		})
	} catch (error) {
		console.log(error)
		return res.status(404).json({ message: 'Kategoriler Güncellenirken Teknik Hata', success: false })
	}
}

const changeCategoryName = async (req, res) => {
	const { title, categoryId } = req.body

	try {
		const category = await Category.findByIdAndUpdate(categoryId, {title}, { new: true })
		return res.status(200).json({ message:'Kategori İsmi Başarıyla Güncellendi', success: true, category})
	} catch (error) {
		return res.status(404).json({ message: 'Kategori İsmi Güncellenirken Hata Oluştu', success: false })
	}
}

const getAllProducts = async (req, res) => {
	const { categoryId } = req.params

	if(!categoryId){
		return res.status(404).json({ message: 'Ürünler Getirilirken Hata Oluştu', success: false })
	}

	try {
		const category = await Category.findById(categoryId)

		if(!category){
			return res.status(404).json({ message: 'Ürünler Getirilirken Hata Oluştu', success: false })
		}

		const products = await Product.find({ categoryId })
		return res.status(201).json({ message: 'Ürünler Başarıyla Getirildi', success: true, products, category })
	} catch (error) {
		console.log(error)
		return res.status(404).json({ message: 'Ürünler Getirilirken Hata Oluştu', success: false })
	}
}

const addProduct = async (req, res) => {
	const { categoryId, name, index, price, isAvailable } = req.body

	try {
		const category = await Category.findById(categoryId)

		if (!category || !name || !(typeof index === 'number' || index) || !(typeof index === 'number' || index) || !categoryId) {
			return res.status(404).json({ message: 'Eksik Bilgi', success: false })
		}

		const newProduct = new Product({ name, index, price, categoryId, isAvailable })

		const product = await newProduct.save()
		return res.status(201).json({ message: 'Ürün oluşturuldu', success: true, product })
	} catch (error) {
		console.log(error)
		return res.status(404).json({ message: 'Ürün oluşturulurken hata oluştu', success: false })
	}
}

const deleteProduct = async (req, res) => {
	const { productId } = req.body
	if(!productId){
		return res.status(404).json({ message: 'Ürün Silinirken Hata Oluştu', success: false })
	}

	try {
		const product = await Product.findByIdAndDelete(productId)
		if(!product){
			return res.status(404).json({ message: 'Ürün Silinirken Hata Oluştu', success: false })
		}
		return res.status(201).json({ message: 'Ürünler Başarıyla Getirildi', success: true, product })
	} catch (error) {
		console.log(error)
		return res.status(404).json({ message: 'Ürün Silinirken Hata Oluştu', success: false })
	}
}

const setProductsIndex = async (req, res) => {
	const { products } = req.body
	const promises = []
	if (!products) {
		return res.status(406).json({ message: 'Ürünler Güncellenirken Teknik Hata', success: false })
	}
	products.forEach((product) => {
		promises.push(updateProduct(product))
	})

	try {
		Promise.all(promises).then((response) => {
			return res.status(200).json({ message: 'Ürünler güncellendi', success: true })
		})
	} catch (error) {
		console.log(error)
		return res.status(404).json({ message: 'Ürünler Güncellenirken Teknik Hata', success: false })
	}
}

const updateProductAsync = async (req, res) => {
	const { productId } = req.body
	try {
		const product = await Product.findByIdAndUpdate(productId, {...req.body}, { new:true })
		return res.status(200).json({message:'Ürün Başarıyla Güncellendi', success: true, product})
	} catch (error) {
		console.log(error)
		return res.status(404).json({ message: 'Ürün Güncellenirken Teknik Hata', success: false })
	}
}

const updateProduct = (product) => {
	return Product.findByIdAndUpdate(product._id, product)
}

const updateCategory = (category) => {
	return Category.findByIdAndUpdate(category._id, category)
}

module.exports = {
	addCategory,
	allCategories,
	deleteCategory,
	setCategoriesIndex,
	addProduct,
	getAllProducts,
	deleteProduct,
	changeCategoryName,
	setProductsIndex,
	updateProductAsync
}
