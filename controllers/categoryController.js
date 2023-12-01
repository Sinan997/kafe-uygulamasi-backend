const Category = require('../models/Category');
const Product = require('../models/Product');

const getCategory = async (req, res) => {
  const { categoryId } = req.params;

  if (!categoryId) {
    return res.status(404).json({ message: 'Eksik bilgi', success: false });
  }

  try {
    const category = await Category.findById(categoryId);
    return res
      .status(201)
      .json({ message: 'Kategori Başarıyla Getirildi', success: true, category });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: 'Kategori Getirilirken Hata Oluştu', success: false });
  }
};

const getAllProducts = async (req, res) => {
  const { categoryId } = req.params;

  if (!categoryId) {
    return res.status(404).json({ message: 'Ürünler Getirilirken Hata Oluştu', success: false });
  }

  try {
    const category = await Category.findById(categoryId).populate('products');
    const products = category.products;
    return res
      .status(201)
      .json({ message: 'Ürünler Başarıyla Getirildi', success: true, products });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: 'Ürünler Getirilirken Hata Oluştu', success: false });
  }
};

const addProduct = async (req, res) => {
  const { categoryId, name, price, isAvailable } = req.body;
  if (!name || !price.toString() || !categoryId) {
    return res.status(404).json({ message: 'Eksik Bilgi', success: false });
  }
  try {
    const category = await Category.findById(categoryId).populate('products');
    const index = category.products.length;

    const product = await new Product({ name, index, price, categoryId, isAvailable }).save();
    await category.addToProducts(product._id);

    return res.status(201).json({ message: 'Ürün oluşturuldu', success: true });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: 'Ürün oluşturulurken hata oluştu', success: false });
  }
};

const changeCategoryName = async (req, res) => {
  const { title, categoryId } = req.body;

  try {
    const category = await Category.findByIdAndUpdate(categoryId, { title }, { new: true });
    return res
      .status(200)
      .json({ message: 'Kategori İsmi Başarıyla Güncellendi', success: true, category });
  } catch (error) {
    return res
      .status(404)
      .json({ message: 'Kategori İsmi Güncellenirken Hata Oluştu', success: false });
  }
};

const deleteProduct = async (req, res) => {
  const { productId } = req.body;
  if (!productId) {
    return res.status(404).json({ message: 'Ürün Silinirken Hata Oluştu', success: false });
  }

  try {
    const product = await Product.findByIdAndDelete(productId);
    const category = await Category.findById(product.categoryId);
    await category.removeFromProducts(productId);
    if (!product) {
      return res.status(404).json({ message: 'Ürün Silinirken Hata Oluştu', success: false });
    }
    return res.status(201).json({ message: 'Ürünler Başarıyla Getirildi', success: true });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: 'Ürün Silinirken Hata Oluştu', success: false });
  }
};

const setProductsIndex = async (req, res) => {
  const { products } = req.body;
  const promises = [];
  if (!products) {
    return res.status(406).json({ message: 'Ürünler Güncellenirken Teknik Hata', success: false });
  }
  products.forEach((product) => {
    promises.push(updateProductIndex(product));
  });

  try {
    Promise.all(promises).then((response) => {
      return res.status(200).json({ message: 'Ürünler güncellendi', success: true });
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: 'Ürünler Güncellenirken Teknik Hata', success: false });
  }
};

const updateProductIndex = (product) => {
  return Product.findByIdAndUpdate(product._id, product);
};

const updateProductAsync = async (req, res) => {
  const { productId } = req.body;
  try {
    await Product.findByIdAndUpdate(productId, { ...req.body });
    return res.status(200).json({ message: 'Ürün Başarıyla Güncellendi', success: true });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: 'Ürün Güncellenirken Teknik Hata', success: false });
  }
};


module.exports = {
  getCategory,
  getAllProducts,
  addProduct,
  changeCategoryName,
  deleteProduct,
  setProductsIndex,
  updateProductAsync,
};
