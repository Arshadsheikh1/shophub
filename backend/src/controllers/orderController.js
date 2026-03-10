import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import AppError from '../utils/errorHandler.js';
import { validateOrder, validateOrderStatus } from '../validators/orderValidator.js';

export const createOrder = async (req, res, next) => {
  try {
    validateOrder(req.body);

    const { shippingAddress, paymentMethod, notes } = req.body;

    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

    if (!cart || cart.items.length === 0) {
      return next(new AppError('Cart is empty', 400));
    }

    const items = [];
    let totalAmount = 0;

    for (const cartItem of cart.items) {
      const product = cartItem.product;

      if (product.isActive === false) {
        return next(new AppError(`Product "${product.name}" is no longer available`, 400));
      }

      if (product.stock < cartItem.quantity) {
        return next(
          new AppError(`Insufficient stock for "${product.name}". Only ${product.stock} available`, 400)
        );
      }

      const itemSubtotal = cartItem.price * cartItem.quantity;
      items.push({
        product: product._id,
        name: product.name,
        sku: product.sku,
        quantity: cartItem.quantity,
        price: cartItem.price,
        subtotal: itemSubtotal,
      });

      totalAmount += itemSubtotal;

      product.stock -= cartItem.quantity;
      await product.save();
    }

    const order = await Order.create({
      user: req.user._id,
      items,
      totalAmount,
      shippingAddress,
      paymentMethod,
      notes,
    });

    cart.items = [];
    await cart.save();

    const populatedOrder = await order.populate('items.product', 'name sku');

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: populatedOrder,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserOrders = async (req, res, next) => {
  try {
    const { status, paymentStatus, limit = 10, page = 1 } = req.query;

    let query = Order.find({ user: req.user._id });

    if (status) {
      query = query.where({ orderStatus: status });
    }

    if (paymentStatus) {
      query = query.where({ paymentStatus });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Order.countDocuments(query);

    const orders = await query
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('items.product', 'name sku');

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id).populate('items.product', 'name sku').populate('user', 'email name');

    if (!order) {
      return next(new AppError('Order not found', 404));
    }

    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return next(new AppError('Access denied', 403));
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllOrders = async (req, res, next) => {
  try {
    const { status, paymentStatus, userId, limit = 20, page = 1 } = req.query;

    let query = Order.find();

    if (status) {
      query = query.where({ orderStatus: status });
    }

    if (paymentStatus) {
      query = query.where({ paymentStatus });
    }

    if (userId) {
      query = query.where({ user: userId });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Order.countDocuments(query);

    const orders = await query
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('items.product', 'name sku')
      .populate('user', 'email name');

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    validateOrderStatus(req.body);

    const { id } = req.params;
    const { orderStatus, paymentStatus, trackingNumber, notes } = req.body;

    const order = await Order.findById(id);

    if (!order) {
      return next(new AppError('Order not found', 404));
    }

    if (orderStatus) {
      if (orderStatus === 'cancelled' && order.paymentStatus === 'paid') {
        return next(new AppError('Cannot cancel a paid order. Request refund instead.', 400));
      }

      order.orderStatus = orderStatus;
    }

    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }

    if (trackingNumber) {
      order.trackingNumber = trackingNumber;
    }

    if (notes) {
      order.notes = notes;
    }

    await order.save();

    const updatedOrder = await order.populate('items.product', 'name sku').populate('user', 'email name');

    res.status(200).json({
      success: true,
      message: 'Order updated successfully',
      data: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};

export const cancelOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const order = await Order.findById(id);

    if (!order) {
      return next(new AppError('Order not found', 404));
    }

    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return next(new AppError('Access denied', 403));
    }

    if (order.orderStatus === 'shipped' || order.orderStatus === 'delivered') {
      return next(new AppError('Cannot cancel shipped or delivered orders', 400));
    }

    if (order.orderStatus === 'cancelled') {
      return next(new AppError('Order is already cancelled', 400));
    }

    order.orderStatus = 'cancelled';
    order.cancellationReason = reason;

    if (order.paymentStatus === 'paid') {
      order.paymentStatus = 'failed';
    }

    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }

    await order.save();

    const updatedOrder = await order.populate('items.product', 'name sku').populate('user', 'email name');

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderStats = async (req, res, next) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);

    const ordersByStatus = await Order.aggregate([{ $group: { _id: '$orderStatus', count: { $sum: 1 } } }]);

    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        ordersByStatus,
      },
    });
  } catch (error) {
    next(error);
  }
};
