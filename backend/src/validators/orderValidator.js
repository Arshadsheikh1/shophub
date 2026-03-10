import AppError from '../utils/errorHandler.js';

const VALID_PAYMENT_METHODS = ['credit_card', 'debit_card', 'paypal', 'bank_transfer', 'razorpay', 'cash_on_delivery'];

export const validateOrder = (data) => {
  const { shippingAddress, paymentMethod } = data;

  if (!paymentMethod || !VALID_PAYMENT_METHODS.includes(paymentMethod)) {
    throw new AppError(
      `Invalid payment method. Must be one of: ${VALID_PAYMENT_METHODS.join(', ')}`,
      400
    );
  }

  if (!shippingAddress) {
    throw new AppError('Shipping address is required', 400);
  }

  const { fullName, street, city, state, zipCode, country, phone } = shippingAddress;

  if (!fullName || fullName.trim().length < 2) {
    throw new AppError('Full name must be at least 2 characters', 400);
  }

  if (!street || street.trim().length < 5) {
    throw new AppError('Street address must be at least 5 characters', 400);
  }

  if (!city || city.trim().length < 2) {
    throw new AppError('City must be at least 2 characters', 400);
  }

  if (!state || state.trim().length < 2) {
    throw new AppError('State must be at least 2 characters', 400);
  }

  if (!zipCode || zipCode.trim().length < 3) {
    throw new AppError('Zip code must be at least 3 characters', 400);
  }

  if (!phone || !/^\d{10,}$/.test(phone.replace(/\D/g, ''))) {
    throw new AppError('Please provide a valid phone number', 400);
  }

  if (country && country.length < 2) {
    throw new AppError('Country must be at least 2 characters', 400);
  }
};

export const validateOrderStatus = (data) => {
  const { orderStatus, paymentStatus } = data;

  const validOrderStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  const validPaymentStatuses = ['pending', 'paid', 'failed', 'cancelled'];

  if (orderStatus && !validOrderStatuses.includes(orderStatus)) {
    throw new AppError(`Invalid order status: ${orderStatus}`, 400);
  }

  if (paymentStatus && !validPaymentStatuses.includes(paymentStatus)) {
    throw new AppError(`Invalid payment status: ${paymentStatus}`, 400);
  }
};
