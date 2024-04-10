const { roles } = require('../constants/roles');

const isWaiterOrBusiness = (req, res, next) => {
  try {
    if (req.role === roles.Business || req.role === roles.Waiter) {
      next();
    } else {
      return res.status(403).json({ message: 'Yetkili değil', success: false });
    }
  } catch (error) {
    return res.status(401).json({ message: 'Token geçersiz', success: false });
  }
};

module.exports = {
  isWaiterOrBusiness,
};
