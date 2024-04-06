const Table = require('../models/Table');
const Order = require('../models/Order');
const Business = require('../models/Business');
const { getSocket } = require('../socketController');

const addTable = async (req, res) => {
  const { name } = req.body;
  const businessId = req.user.businessId;
  try {
    if (!name) {
      return res.status(406).json({ code: 'MISSING_FIELDS', message: 'Fill required places.' });
    }

    const isNameExist = await Table.findOne({ name, businessId });

    if (isNameExist) {
      return res.status(406).json({
        code: 'NAME_EXIST',
        data: { name },
        message: `${name} is already used`,
      });
    }

    await new Table({ name, businessId }).save();

    return res.status(201).json({
      code: 'TABLE_CREATED',
      message: 'Table created succesfully.',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ code: 'SERVER_ERROR', message: 'Server failed.' });
  }
};

const getAllTables = async (req, res) => {
  const businessId = req.user.businessId;
  try {
    const tables = await Table.find({ businessId }, { businessId: 0, __v: 0 });

    return res.status(200).json({ tables });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ code: 'SERVER_ERROR', message: 'Server failed.' });
  }
};

const deleteTable = async (req, res) => {
  const { id } = req.body;
  try {
    // DELETE BUSINESS
    const table = await Table.findByIdAndDelete(id);
    if (!table) {
      return res.status(404).json({ code: 'TABLE_NOT_FOUND', message: 'Table not found.' });
    }

    return res
      .status(200)
      .json({ code: 'BUSINESS_DELETED', message: 'Business deleted succesfully.' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ code: 'SERVER_ERROR', message: 'Server failed.' });
  }
};

const updateTable = async (req, res) => {
  const { id, name } = req.body;
  const businessId = req.user.businessId;
  try {
    const isNameExist = await Table.findOne({ name, businessId });

    if (isNameExist) {
      return res.status(406).json({
        code: 'NAME_EXIST',
        data: { name },
        message: `${name} is already used`,
      });
    }
    await Table.findByIdAndUpdate(id, { name });
    return res.status(200).json({ code: 'TABLE_UPDATED', message: 'Table updated successfully.' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ code: 'SERVER_ERROR', message: 'Server failed.' });
  }
};

const addOrder = async (req, res) => {
  let { orders, tableId } = req.body;
  const businessId = req.user.businessId;
  try {
    const table = await Table.findOne({ _id: tableId, businessId });
    const currentOrders = table.orders;

    // MANIPULATE ORDERS AND SAVE ORDERS
    const newOrders = orders.map((order) => {
      return {
        productId: order._id,
        amount: order.amount,
      };
    });
    const manipulatedArray = [];

    newOrders.forEach((order) => {
      const isExist = currentOrders.find(
        (currentOrder) => currentOrder.productId.toString() == order.productId.toString(),
      );

      if (isExist) {
        isExist.amount += order.amount;
        return;
      }
      manipulatedArray.push(order);
    });

    table.orders = [...table.orders, ...manipulatedArray];

    table.save();

    const orderList = await Order.insertMany(
      orders.map((order) => ({ productId: order._id, tableId, businessId, amount: order.amount })),
    );

    // ADD TO THE ORDERS
    const business = await Business.findById(businessId);
    await business.addOrder(orderList.map((order) => order._id) || []);

    socket = getSocket();
    socket.emit(businessId._id, orderList[0]._id);

    return res.status(201).json({
      code: 'ORDER_CREATED',
      message: 'Order created succesfully.',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ code: 'SERVER_ERROR', message: 'Server failed.' });
  }
};

const getTableOrders = async (req, res) => {
  const { tableId } = req.body;
  try {
    const table = await Table.findById(tableId)
      .select('-orders._id')
      .populate({ path: 'orders.productId', select: '-businessId -index -__v' });
    const orders = table?.orders.map((order) => {
      return {
        product: order.productId,
        amount: order.amount,
      };
    });
    return res.status(200).json({ orders });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ code: 'SERVER_ERROR', message: 'Server failed.' });
  }
};

const takeOrders = async (req, res) => {
  const { tableId, orders } = req.body;
  try {
    const table = await Table.findById(tableId);
    const tableOrders = [...table.orders];
    orders.map((order) => {
      const tableOrder = tableOrders.find(
        (tableOrder) => tableOrder.productId.toString() === order._id.toString(),
      );
      tableOrder.amount -= order.amount;
    });
    table.orders = [...tableOrders.filter((order) => order.amount > 0)];
    await table.save();
    return res.status(200).json({ code: 'ORDERS_TAKEN', message: 'Orders taken successfully.' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ code: 'SERVER_ERROR', message: 'Server failed.' });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const { orderId, tableId } = req.body;
    const businessId = req.user.businessId._id;
    const business = await Business.findById(businessId);
    await Order.findByIdAndDelete(orderId);
    await business.removeOrder(orderId);
    const table = await Table.findById(tableId);
    const tableOrders = [...table.orders];
    table.orders = [...tableOrders.filter((order) => order._id === orderId)];
    await table.save();
    socket = getSocket();
    socket.emit(businessId, new Date());
    return res.status(201).json({
      code: 'ORDER_DELETED',
      message: 'Order deleted successfully.',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ code: 'SERVER_ERROR', message: 'Server failed.' });
  }
};

module.exports = {
  addTable,
  getAllTables,
  deleteTable,
  updateTable,
  addOrder,
  getTableOrders,
  takeOrders,
  deleteOrder,
};
