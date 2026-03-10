import crypto from 'crypto';
import Payment from '../models/Payment.js';
import Order from '../models/Order.js';
import razorpay from '../config/razorpay.js';
import AppError from '../utils/errorHandler.js';

export const createPaymentOrder = async (req, res, next) => {
  try {
    const { orderId } = req.body;
    const userId = req.user.id;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        error: 'Order ID is required',
      });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found',
      });
    }

    if (order.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized - Order does not belong to this user',
      });
    }

    if (order.paymentStatus === 'paid') {
      return res.status(400).json({
        success: false,
        error: 'Order is already paid',
      });
    }

    const existingPayment = await Payment.findOne({
      order: orderId,
      status: 'pending',
    });

    if (existingPayment) {
      return res.status(400).json({
        success: false,
        error: 'A payment is already in progress for this order',
      });
    }

    const amount = Math.round(order.totalAmount * 100);

    const razorpayOrder = await razorpay.orders.create({
      amount,
      currency: 'INR',
      receipt: order.orderNumber,
      description: `Payment for Order ${order.orderNumber}`,
      customer_notify: 1,
      notes: {
        orderId: order._id.toString(),
        userId: userId,
        orderNumber: order.orderNumber,
      },
    });

    const payment = new Payment({
      order: orderId,
      user: userId,
      razorpayOrderId: razorpayOrder.id,
      amount: order.totalAmount,
      currency: 'INR',
      description: `Payment for Order ${order.orderNumber}`,
      contactInfo: {
        email: req.user.email || '',
        phone: order.shippingAddress?.phone || '',
      },
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    await payment.save();

    res.status(201).json({
      success: true,
      data: {
        paymentId: payment._id,
        razorpayOrderId: razorpayOrder.id,
        amount: order.totalAmount,
        currency: 'INR',
        orderNumber: order.orderNumber,
      },
    });
  } catch (error) {
    console.error('Error creating payment order:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create payment order',
    });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        error: 'Missing required payment details',
      });
    }

    const payment = await Payment.findByRazorpayOrderId(razorpay_order_id);
    if (!payment) {
      return res.status(404).json({
        success: false,
        error: 'Payment record not found',
      });
    }

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      await payment.markAsFailed('Invalid signature verification');
      return res.status(400).json({
        success: false,
        error: 'Payment signature verification failed',
      });
    }

    await payment.markAsSuccess(razorpay_payment_id, razorpay_signature);

    const order = await Order.findById(payment.order);
    if (order) {
      order.paymentStatus = 'paid';
      order.paymentMethod = 'razorpay';
      await order.save();
    }

    res.status(200).json({
      success: true,
      data: {
        paymentId: payment._id,
        orderId: payment.order,
        razorpayPaymentId: razorpay_payment_id,
        message: 'Payment verified successfully',
      },
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Payment verification failed',
    });
  }
};

export const getPaymentStatus = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const userId = req.user.id;

    const payment = await Payment.findById(paymentId).populate('order');
    if (!payment) {
      return res.status(404).json({
        success: false,
        error: 'Payment not found',
      });
    }

    if (payment.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        paymentId: payment._id,
        status: payment.status,
        amount: payment.amount,
        razorpayPaymentId: payment.razorpayPaymentId,
        orderNumber: payment.order?.orderNumber,
        createdAt: payment.createdAt,
      },
    });
  } catch (error) {
    console.error('Error fetching payment status:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch payment status',
    });
  }
};

export const getOrderPayment = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found',
      });
    }

    if (order.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized',
      });
    }

    const payment = await Payment.findOne({ order: orderId }).sort(
      { createdAt: -1 }
    );

    if (!payment) {
      return res.status(404).json({
        success: false,
        error: 'No payment found for this order',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        paymentId: payment._id,
        status: payment.status,
        amount: payment.amount,
        razorpayPaymentId: payment.razorpayPaymentId,
        razorpayOrderId: payment.razorpayOrderId,
        failureReason: payment.failureReason,
        createdAt: payment.createdAt,
        updatedAt: payment.updatedAt,
      },
    });
  } catch (error) {
    console.error('Error fetching order payment:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch order payment',
    });
  }
};

export const retryPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const userId = req.user.id;

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({
        success: false,
        error: 'Payment not found',
      });
    }

    if (payment.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized',
      });
    }

    if (payment.status === 'captured') {
      return res.status(400).json({
        success: false,
        error: 'Payment already successful',
      });
    }

    if (payment.retryCount >= 3) {
      return res.status(400).json({
        success: false,
        error: 'Maximum retry attempts exceeded. Contact support.',
      });
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(payment.amount * 100),
      currency: payment.currency,
      receipt: `RETRY-${payment._id.toString()}`,
      description: `Retry payment for Order ${payment.description}`,
      customer_notify: 1,
      notes: {
        paymentId: payment._id.toString(),
        userId: userId,
        retry: true,
        originalPaymentId: payment.razorpayOrderId,
      },
    });

    payment.razorpayOrderId = razorpayOrder.id;
    payment.status = 'pending';
    await payment.save();

    res.status(200).json({
      success: true,
      data: {
        paymentId: payment._id,
        razorpayOrderId: razorpayOrder.id,
        amount: payment.amount,
        message: 'Payment retry initiated',
      },
    });
  } catch (error) {
    console.error('Error retrying payment:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to retry payment',
    });
  }
};

export const getPaymentHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, status } = req.query;

    const query = { user: userId };
    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;
    const payments = await Payment.find(query)
      .populate('order', 'orderNumber totalAmount orderStatus')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Payment.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        payments: payments.map((p) => ({
          paymentId: p._id,
          status: p.status,
          amount: p.amount,
          razorpayPaymentId: p.razorpayPaymentId,
          orderNumber: p.order?.orderNumber,
          orderStatus: p.order?.orderStatus,
          createdAt: p.createdAt,
        })),
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching payment history:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch payment history',
    });
  }
};
