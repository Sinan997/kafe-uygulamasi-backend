const Business = require('../models/Business');
const Order = require('../models/Order');
const { getSocket } = require('../socketController');

const getAllOrders = async (req, res) => {
  try {
    const businessId = req.user.businessId._id;
    const business = await Business.findById(businessId).populate({
      path: 'orders',
      populate: { path: 'productId tableId' },
    });
    const orders = business.orders || [];
    return res.status(200).json({ orders });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ code: 'SERVER_ERROR', message: 'Server failed.' });
  }
};

const setOrderReady = async (req, res) => {
  try {
    const { orderId } = req.params;
    const businessId = req.user.businessId._id;
    const order = await Order.findById(orderId);
    order.isReady = true;
    await order.save();
    socket = getSocket();
    socket.emit(businessId, new Date());
    return res.status(201).json({
      code: 'ORDER_SET_READY',
      message: 'Order setted as ready.',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ code: 'SERVER_ERROR', message: 'Server failed.' });
  }
};

const setOrderDelivered = async (req, res) => {
  try {
    const { orderId } = req.params;
    const businessId = req.user.businessId._id;
    const business = await Business.findById(businessId);
    await Order.findByIdAndDelete(orderId);
    await business.removeOrder(orderId);
    socket = getSocket();
    socket.emit(businessId, new Date());
    return res.status(201).json({
      code: 'ORDER_SET_DELIVERED',
      message: 'Order delivered successfully.',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ code: 'SERVER_ERROR', message: 'Server failed.' });
  }
};

module.exports = {
  getAllOrders,
  setOrderReady,
  setOrderDelivered,
};
