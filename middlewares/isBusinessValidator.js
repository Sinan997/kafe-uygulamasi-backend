const Business = require('../models/Business');

const isBusiness = async (req, res, next) => {
  try {
    const user = req.user;
    const business = await Business.findById(req.user.businessId)
    req.business = business;
    if (business.users.includes(user._id) && user.role === 'business') {
      next();
    } else {
      return res.status(403).json({ message: 'Unauthorized', success: false });
    }
  } catch (error) {
    return res.status(403).json({ message: 'Unauthorized', success: false });
  }
};

module.exports = {
  isBusiness,
};
