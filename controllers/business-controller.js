const Business = require('../models/Business');

const getAllOrders = async (req, res) => {
  try {
    const businessId = req.user.businessId;
    const business = await Business.findById(businessId).populate({
      path: 'orders',
      populate: { path: 'productId', populate: { path: 'categoryId' } },
    });
    const orders = business.orders;
    return res
      .status(200)
      .json({ code: 'ORDERS_TAKEN', message: 'Orders taken successfully.', orders });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ code: 'SERVER_ERROR', message: 'Server failed.' });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const businessId = req.user.businessId;
    const business = await Business.findById(businessId).populate({ path: 'categories', populate: { path: 'products' }});
    const categories = business.categories;
    return res
      .status(200)
      .json({ code: 'CATEGORIES_TAKEN', message: 'Categories taken successfully.', categories });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ code: 'SERVER_ERROR', message: 'Server failed.' });
  }
};

module.exports = {
  getAllOrders,
  getAllCategories,
};
