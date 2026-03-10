import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

export const getDashboard = async (req, res, next) => {
  try {
    const [totalUsers, totalProducts, totalOrders, revenueResult, recentOrders] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
      Order.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
      Order.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .populate('user', 'name email')
        .lean(),
    ]);

    const totalRevenue = revenueResult[0]?.total || 0;

    const recentOrdersFormatted = recentOrders.map((order) => ({
      _id: order._id,
      orderNumber: order.orderNumber,
      customerName: order.shippingAddress?.fullName || order.user?.name || 'N/A',
      totalAmount: order.totalAmount,
      orderStatus: order.orderStatus,
    }));

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue,
        recentOrders: recentOrdersFormatted,
      },
    });
  } catch (error) {
    next(error);
  }
};
