const Category = require('../models/Category');

const allCategories = async (req, res) => {
  try {
    const business = await req.business.populate('categories');
    const categories = business.categories;
    return res
      .status(200)
      .json({ success: true, message: 'Kategoriler Başarıyla Getirildi', categories });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: 'Kategoriler Getirilemedi', success: false });
  }
};

const addCategory = async (req, res) => {
  const { name } = req.body;
  const business = await req.business.populate('categories');
  const categories = business.categories;
  try {
    if (!name) {
      return res.status(406).json({ message: 'Gerekli Alanları Doldurunuz', success: false });
    }

    const isNameAvailable = categories.find((category) => category.name === name);

    if (isNameAvailable) {
      return res.status(406).json({ message: 'Bu İsimde Kategori Bulunmakta', success: false });
    }

    const index = business.categories.length;

    const newCategory = await new Category({ name, index }).save();
    await business.addToCategories(newCategory._id);
    return res.status(201).json({ message: 'Kategori Oluşturuldu', success: true });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: 'Kategori oluşturulamadı', success: false });
  }
};

const deleteCategory = async (req, res) => {
  const { id } = req.body;
  const business = req.business;

  if (!id) {
    return res.status(406).json({ message: 'Kategori Silinirken Teknik Hata', success: false });
  }

  try {
    const isDeleted = await Category.findByIdAndDelete(id);
    await business.removeFromCategories(id);
    if (isDeleted) {
      return res.status(200).json({ message: 'Kategori Başarıyla Silindi', success: true });
    }
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: 'Kategori silinemedi', success: false });
  }
};

const setCategoriesIndex = async (req, res) => {
  const { categories } = req.body;
  console.log(categories);
  const promises = [];
  if (!categories) {
    return res
      .status(406)
      .json({ message: 'Kategoriler Güncellenirken Teknik Hata', success: false });
  }
  categories.forEach((category) => {
    promises.push(updateCategory(category));
  });

  try {
    Promise.all(promises).then((response) => {
      return res.status(200).json({ message: 'Kategoriler güncellendi', success: true });
    });
  } catch (error) {
    console.log(error);
    return res
      .status(404)
      .json({ message: 'Kategoriler Güncellenirken Teknik Hata', success: false });
  }
};

const updateCategory = (category) => {
  return Category.findByIdAndUpdate(category._id, category);
};

module.exports = {
  addCategory,
  allCategories,
  deleteCategory,
  setCategoriesIndex,
};
