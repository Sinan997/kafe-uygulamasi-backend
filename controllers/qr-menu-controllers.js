const Business = require('../models/Business');

const getAllCategoriesAndProducts = async (req, res) => {
  try {
    const businessName = req.params.businessName;
    const business = await Business.findOne({ name: businessName }).populate({
      path: 'categories',
      populate: { path: 'products' },
    });
    categories = business.categories || [];
    return res.status(200).json({ categories });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ code: 'SERVER_ERROR', message: 'Server failed.' });
  }
};

module.exports = {
  getAllCategoriesAndProducts,
};
