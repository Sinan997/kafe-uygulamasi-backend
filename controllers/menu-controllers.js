const Category = require('../models/Category');
const Business = require('../models/Business');
const Product = require('../models/Product');

const allCategories = async (req, res) => {
  const businessId = req.user.businessId;
  try {
    const categories = await Category.find({ businessId });

    return res.status(200).json({ categories });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ code: 'SERVER_ERROR', message: 'Server failed.' });
  }
};

const allCategoriesWithProducts = async (req, res) => {
  const businessId = req.user.businessId;
  try {
    const categories = await Category.find({ businessId }).populate('products');

    return res.status(200).json({ categories });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ code: 'SERVER_ERROR', message: 'Server failed.' });
  }
};

const addCategory = async (req, res) => {
  const { name } = req.body;
  const businessId = req.user.businessId;
  try {
    if (!name) {
      return res.status(406).json({ code: 'MISSING_FIELDS', message: 'Fill required places.' });
    }

    const business = await Business.findById(businessId).populate('categories');
    const categories = business.categories;

    const isNameExist = categories.find((category) => category.name === name);

    if (isNameExist) {
      return res.status(406).json({
        code: 'CATEGORY_EXIST',
        data: { name },
        message: `${name} is already used`,
      });
    }

    const index = business.categories.length;

    const newCategory = await new Category({ name, index, businessId }).save();
    await business.addToCategories(newCategory._id);
    return res.status(201).json({
      code: 'CATEGORY_CREATED',
      message: 'Category created succesfully.',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ code: 'SERVER_ERROR', message: 'Server failed.' });
  }
};

const deleteCategory = async (req, res) => {
  const { id } = req.body;
  const businessId = req.user.businessId;
  try {
    if (!id) {
      return res
        .status(406)
        .json({ code: 'CATEGORY_DELETE_ERROR', message: "Couldn't delete category." });
    }
    const business = await Business.findById(businessId);

    const isDeleted = await Category.findByIdAndDelete(id);
    await business.removeFromCategories(id);
    if (isDeleted) {
      return res.status(200).json({
        code: 'CATEGORY_DELETED',
        message: 'Category deleted successfully.',
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ code: 'SERVER_ERROR', message: 'Server failed.' });
  }
};

const setCategoriesIndex = async (req, res) => {
  const { categories } = req.body;

  try {
    const promises = [];
    if (!categories) {
      return res
        .status(406)
        .json({ code: 'CATEGORY_UPDATE', message: 'An error while updating categories.' });
    }
    categories.forEach((category) => {
      promises.push(updateCategory(category));
    });
    Promise.all(promises).then(() => {
      return res.status(200).json({ code: 'CATEGORIES_UPDATED', message: 'Categories updated.' });
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ code: 'SERVER_ERROR', message: 'Server failed.' });
  }
};

const updateCategory = (category) => {
  return Category.findByIdAndUpdate(category._id, category);
};

const addProduct = async (req, res) => {
  const businessId = req.user.businessId;
  const { categoryId, name, price, isAvailable } = req.body;
  if (!name || isNaN(price) || !categoryId || isAvailable === undefined) {
    return res.status(406).json({ code: 'MISSING_FIELDS', message: 'Fill required places.' });
  }
  try {
    const category = await Category.findById(categoryId).populate('products');
    const index = category.products.length;

    const isNameExist = category.products.find(
      (product) => product.name.toLowerCase() === name.toLowerCase(),
    );
    if (isNameExist) {
      return res.status(406).json({
        code: 'PRODUCT_EXIST',
        data: { name },
        message: `${name} is already used`,
      });
    }

    const product = await new Product({
      name,
      price,
      index,
      isAvailable,
      categoryId,
      businessId,
    }).save();
    await category.addToProducts(product._id);

    return res.status(201).json({
      code: 'PRODUCT_CREATED',
      message: 'Product created succesfully.',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ code: 'SERVER_ERROR', message: 'Server failed.' });
  }
};

const getAllProducts = async (req, res) => {
  const { categoryId } = req.params;

  try {
    if (!categoryId) {
      return res.status(500).json({ code: 'SERVER_ERROR', message: 'Server failed.' });
    }
    const category = await Category.findById(categoryId).populate('products');
    const products = category.products;
    return res.status(200).json({ products });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ code: 'SERVER_ERROR', message: 'Server failed.' });
  }
};

const changeCategoryName = async (req, res) => {
  const { name, categoryId } = req.body;

  try {
    if (!name || !categoryId) {
      return res.status(500).json({ code: 'SERVER_ERROR', message: 'Server failed.' });
    }
    await Category.findByIdAndUpdate(categoryId, { name });
    return res.status(200).json({
      code: 'CATEGORY_UPDATED',
      message: 'Category updated successfully.',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ code: 'SERVER_ERROR', message: 'Server failed.' });
  }
};

const setProductsIndex = async (req, res) => {
  const { products } = req.body;
  const promises = [];
  if (!products) {
    return res
      .status(406)
      .json({ code: 'PRODUCT_UPDATE', message: 'An error while updating products.' });
  }
  products.forEach((product) => {
    promises.push(updateProductIndex(product));
  });

  try {
    Promise.all(promises).then(() => {
      return res.status(200).json({ code: 'PRODUCTS_UPDATED', message: 'Products updated.' });
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ code: 'SERVER_ERROR', message: 'Server failed.' });
  }
};

const updateProductIndex = (product) => {
  return Product.findByIdAndUpdate(product._id, product);
};

const deleteProduct = async (req, res) => {
  const { productId } = req.body;

  try {
    if (!productId) {
      return res.status(500).json({ code: 'SERVER_ERROR', message: 'Server failed.' });
    }
    const product = await Product.findByIdAndDelete(productId);
    const category = await Category.findById(product.categoryId);
    await category.removeFromProducts(productId);
    return res.status(200).json({
      code: 'PRODUCT_DELETED',
      message: 'Product deleted successfully.',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ code: 'SERVER_ERROR', message: 'Server failed.' });
  }
};

const updateProductAsync = async (req, res) => {
  const { productId, categoryId, name } = req.body;
  try {
    const category = await Category.findById(categoryId).populate('products');
    const isNameExist = category.products.find(
      (product) => product.name.toLowerCase() === name.toLowerCase(),
    );

    if (isNameExist) {
      return res.status(406).json({
        code: 'PRODUCT_EXIST',
        data: { name },
        message: `${name} is already used`,
      });
    }

    await Product.findByIdAndUpdate(productId, { ...req.body });
    return res
      .status(200)
      .json({ code: 'PRODUCT_UPDATED', message: 'Product updated successfully.' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ code: 'SERVER_ERROR', message: 'Server failed.' });
  }
};

module.exports = {
  addCategory,
  allCategories,
  allCategoriesWithProducts,
  deleteCategory,
  setCategoriesIndex,
  addProduct,
  getAllProducts,
  setProductsIndex,
  changeCategoryName,
  deleteProduct,
  updateProductAsync,
};
