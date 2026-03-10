import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: [true, 'Order is required'],
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
      index: true,
    },
    razorpayOrderId: {
      type: String,
      required: [true, 'Razorpay Order ID is required'],
      unique: true,
      index: true,
    },
    razorpayPaymentId: {
      type: String,
      sparse: true,
      index: true,
    },
    razorpaySignature: {
      type: String,
      sparse: true,
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount cannot be negative'],
    },
    currency: {
      type: String,
      default: 'INR',
      enum: ['INR', 'USD', 'EUR'],
    },
    status: {
      type: String,
      enum: ['pending', 'authorized', 'captured', 'failed', 'refunded'],
      default: 'pending',
      index: true,
    },
    description: {
      type: String,
      maxlength: 100,
    },
    notes: {
      type: Map,
      of: String,
    },
    failureReason: {
      type: String,
      maxlength: 500,
    },
    receiptId: {
      type: String,
      sparse: true,
    },
    contactInfo: {
      email: String,
      phone: String,
    },
    ipAddress: String,
    userAgent: String,
    retryCount: {
      type: Number,
      default: 0,
    },
    lastRetryAt: Date,
  },
  {
    timestamps: true,
  }
);

paymentSchema.index({ user: 1, createdAt: -1 });
paymentSchema.index({ order: 1 });
paymentSchema.index({ status: 1, createdAt: -1 });
paymentSchema.index({ razorpayOrderId: 1 });

paymentSchema.statics.findByRazorpayOrderId = function (razorpayOrderId) {
  return this.findOne({ razorpayOrderId });
};

paymentSchema.methods.markAsSuccess = function (paymentId, signature) {
  this.razorpayPaymentId = paymentId;
  this.razorpaySignature = signature;
  this.status = 'captured';
  return this.save();
};

paymentSchema.methods.markAsFailed = function (reason) {
  this.failureReason = reason;
  this.status = 'failed';
  this.retryCount += 1;
  this.lastRetryAt = new Date();
  return this.save();
};

export default mongoose.model('Payment', paymentSchema);
