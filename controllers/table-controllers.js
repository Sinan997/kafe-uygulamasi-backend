const Table = require('../models/Table');
const Order = require('../models/Order');
const Business = require('../models/Business');
const Product = require('../models/Product');
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

    return res.status(200).json({ code: 'TABLE_DELETED', message: 'Table deleted succesfully.' });
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
    // SAVE ORDERS TO ORDER COLLECTION
    const orderList = await Order.insertMany(
      orders.map((order) => ({
        productId: order._id,
        tableId,
        businessId,
        amount: order.amount,
        baseAmount: order.amount,
      })),
    );

    // ADD ORDERS TO BUSINESS COLLECTION
    const business = await Business.findById(businessId);
    await business.addOrder(orderList.map((order) => order._id) || []);

    // ADD ORDERS TO TABLE COLLECTION
    const table = await Table.findOne({ _id: tableId });
    table.orders = [...table.orders, ...(orderList.map((order) => order._id) || [])];
    table.save();

    socket = getSocket();

    orderList.forEach(async (order) => {
      const product = await Product.findById(order.productId);
      const table = await Table.findById(order.tableId);

      const orderObj = {
        _id: order._id,
        baseAmount: order.baseAmount,
        amount: order.amount,
        isReady: false,
        isDelivered: false,
        productId: { name: product.name },
        tableId: { name: table.name },
        businessId: order.businessId,
      };

      socket.emit(businessId._id + 'neworder', orderObj);
    });

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
    const table = await Table.findById(tableId).populate({
      path: 'orders',
      populate: { path: 'productId' },
    });

    const orders = table.orders || [];
    return res.status(200).json({ orders });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ code: 'SERVER_ERROR', message: 'Server failed.' });
  }
};

const takeOrders = async (req, res) => {
  const { tableId, orders } = req.body;
  try {
    const businessId = req.user.businessId._id;
    const table = await Table.findById(tableId);

    const finishedOrders = [];
    const reducedOrders = [];
    orders.forEach((element) => {
      if (element.amount === element.pickedAmount) {
        finishedOrders.push({ ...element, amount: 0, isReady: true, isDelivered: true });
      } else {
        reducedOrders.push({ ...element, amount: element.amount - element.pickedAmount });
      }
    });

    const tableOrders = [...table.orders];
    table.orders = [
      ...tableOrders.filter(
        (order) => !finishedOrders.map((o) => o._id).includes(order._id.toString()),
      ),
    ];

    const promises = [];

    reducedOrders.forEach((order) => {
      promises.push(Order.findByIdAndUpdate(order._id, order));
    });

    finishedOrders.forEach((order) => {
      promises.push(Order.findByIdAndUpdate(order._id, order));
    });

    await Promise.all(promises);
    await table.save();

    socket = getSocket();
    socket.emit(businessId, new Date());

    const updatedOrders =
      (
        await Table.findById(tableId).populate({
          path: 'orders',
          populate: { path: 'productId' },
        })
      ).orders || [];
    return res
      .status(200)
      .json({ code: 'ORDERS_TAKEN', message: 'Orders taken successfully.', orders: updatedOrders });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ code: 'SERVER_ERROR', message: 'Server failed.' });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const { orderIds, tableId } = req.body;
    const businessId = req.user.businessId._id;
    const business = await Business.findById(businessId);
    await Order.deleteMany({ _id: { $in: orderIds } });
    await business.removeOrders(orderIds);
    const table = await Table.findById(tableId);
    const tableOrders = [...table.orders];
    table.orders = [...tableOrders.filter((order) => !orderIds.includes(order._id.toString()))];
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
