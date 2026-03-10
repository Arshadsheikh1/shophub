import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { orderAPI } from '../services/api';
import { formatPrice } from '../utils/format';
import { showToast } from '../utils/toast';
import { Loader, CreditCard, Wallet, Building2, Banknote } from 'lucide-react';

const PAYMENT_METHODS = [
  { value: 'credit_card', label: 'Credit Card', icon: CreditCard, description: 'Pay with Visa, Mastercard, or Amex' },
  { value: 'debit_card', label: 'Debit Card', icon: CreditCard, description: 'Pay directly from your bank account' },
  { value: 'paypal', label: 'PayPal', icon: Wallet, description: 'Pay securely with your PayPal account' },
  { value: 'bank_transfer', label: 'Bank Transfer', icon: Building2, description: 'Direct transfer to our bank account' },
  { value: 'cash_on_delivery', label: 'Cash on Delivery', icon: Banknote, description: 'Pay when your order arrives' },
] as const;

export default function Checkout() {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA',
    phone: '',
    paymentMethod: 'credit_card',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    cardName: '',
    notes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'cardNumber') {
      const cleaned = value.replace(/\D/g, '').slice(0, 16);
      setFormData((prev) => ({ ...prev, [name]: cleaned.replace(/(.{4})/g, '$1 ').trim() }));
      return;
    }
    if (name === 'cardExpiry') {
      const cleaned = value.replace(/\D/g, '');
      if (cleaned.length >= 2) {
        setFormData((prev) => ({ ...prev, [name]: `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}` }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
      return;
    }
    if (name === 'cardCvv') {
      setFormData((prev) => ({ ...prev, [name]: value.replace(/\D/g, '').slice(0, 4) }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const needsCardDetails = formData.paymentMethod === 'credit_card' || formData.paymentMethod === 'debit_card';
  const isCod = formData.paymentMethod === 'cash_on_delivery';

  const validateCardDetails = () => {
    const num = formData.cardNumber.replace(/\s/g, '');
    if (num.length < 13 || num.length > 19) return 'Please enter a valid card number';
    const expiry = formData.cardExpiry;
    if (!/^\d{2}\/\d{2}$/.test(expiry)) return 'Please enter a valid expiry (MM/YY)';
    const [mm, yy] = expiry.split('/').map(Number);
    if (mm < 1 || mm > 12) return 'Invalid expiry month';
    if (formData.cardCvv.length < 3) return 'Please enter a valid CVV';
    if (!formData.cardName.trim()) return 'Please enter the name on card';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      showToast('Your cart is empty', 'error');
      return;
    }
    if (needsCardDetails) {
      const err = validateCardDetails();
      if (err) {
        showToast(err, 'error');
        return;
      }
    }

    try {
      setLoading(true);
      await orderAPI.createOrder({
        shippingAddress: {
          fullName: formData.fullName,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
          phone: formData.phone,
        },
        paymentMethod: formData.paymentMethod,
        notes: formData.notes,
      });

      await clearCart();
      showToast('Order placed successfully!', 'success');
      navigate('/orders');
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to place order';
      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-600 mb-4">Your cart is empty</p>
          <button
            onClick={() => navigate('/cart')}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Cart
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Information</h2>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="col-span-2 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
                <input
                  type="text"
                  name="street"
                  placeholder="Street Address"
                  value={formData.street}
                  onChange={handleChange}
                  required
                  className="col-span-2 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
                <input
                  type="text"
                  name="zipCode"
                  placeholder="Zip Code"
                  value={formData.zipCode}
                  onChange={handleChange}
                  required
                  className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
                <input
                  type="text"
                  name="country"
                  placeholder="Country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="col-span-2 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-6 mt-8">Payment Method</h2>
              <div className="space-y-3 mb-6">
                {PAYMENT_METHODS.map((method) => {
                  const Icon = method.icon;
                  const isSelected = formData.paymentMethod === method.value;
                  return (
                    <label
                      key={method.value}
                      className={`flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.value}
                        checked={isSelected}
                        onChange={handleChange}
                        className="mt-1"
                      />
                      <Icon className="h-6 w-6 text-gray-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-gray-900">{method.label}</p>
                        <p className="text-sm text-gray-500">{method.description}</p>
                      </div>
                    </label>
                  );
                })}
              </div>

              {needsCardDetails && (
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6 space-y-4">
                  <h3 className="font-semibold text-gray-900">Card Details</h3>
                  <input
                    type="text"
                    name="cardNumber"
                    placeholder="Card Number (e.g. 4111 1111 1111 1111)"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    required={needsCardDetails}
                    maxLength={19}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="cardExpiry"
                      placeholder="MM/YY"
                      value={formData.cardExpiry}
                      onChange={handleChange}
                      required={needsCardDetails}
                      maxLength={5}
                      className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    />
                    <input
                      type="text"
                      name="cardCvv"
                      placeholder="CVV"
                      value={formData.cardCvv}
                      onChange={handleChange}
                      required={needsCardDetails}
                      maxLength={4}
                      className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <input
                    type="text"
                    name="cardName"
                    placeholder="Name on Card"
                    value={formData.cardName}
                    onChange={handleChange}
                    required={needsCardDetails}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500">Your payment information is encrypted and secure.</p>
                </div>
              )}

              {formData.paymentMethod === 'paypal' && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-amber-800">
                    You will be redirected to PayPal to complete your payment after placing the order.
                  </p>
                </div>
              )}

              {formData.paymentMethod === 'bank_transfer' && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-700">
                    Bank details will be sent to your email. Please complete the transfer within 24 hours.
                  </p>
                </div>
              )}

              {isCod && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-green-800 font-medium">
                    Pay with cash when your order is delivered. Our delivery partner will collect the amount.
                  </p>
                </div>
              )}

              <h2 className="text-2xl font-bold text-gray-900 mb-6">Additional Notes</h2>
              <textarea
                name="notes"
                placeholder="Special instructions or notes (optional)"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 mb-6"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading && <Loader className="h-5 w-5 animate-spin" />}
                <span>{loading ? 'Processing...' : 'Place Order'}</span>
              </button>
            </form>
          </div>

          <div>
            <div className="bg-white p-6 rounded-lg shadow sticky top-20">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6 pb-6 border-b max-h-96 overflow-y-auto">
                {items.map((item) => (
                  <div key={item._id} className="flex justify-between text-sm">
                    <div>
                      <p className="font-medium text-gray-900">{item.product.name}</p>
                      <p className="text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-gray-900">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-2 mb-6 pb-6 border-b">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-bold">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span className="font-bold">Free</span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-bold text-gray-900">
                <span>Total</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
