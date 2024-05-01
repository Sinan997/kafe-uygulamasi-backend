const Business = require('../models/Business');
const Order = require('../models/Order');
const User = require('../models/User');
const { roles } = require('../constants/roles');
const Notification = require('../models/Notification');
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
    const order = await Order.findById(orderId).populate('productId tableId');

    order.isReady = true;
    await order.save();

    socket = getSocket();

    const notification = new Notification({
      tableName: order.tableId.name,
      productName: order.productId.name,
      businessId,
      isRead: false,
      quantity: order.baseAmount,
    });

    await notification.save();

    await User.updateMany(
      { businessId, role: roles.Waiter },
      { $push: { notifications: notification } },
    );
    socket.emit(businessId + 'notification', notification);
    socket.emit(businessId + 'setorderready', orderId);

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
    await Order.findByIdAndUpdate(orderId, { isDelivered: true });
    socket = getSocket();
    socket.emit(businessId + 'orderdelivered', orderId);
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
