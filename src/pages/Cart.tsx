import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice, getProductImageUrl } from '../utils/format';
import { showToast } from '../utils/toast';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useState } from 'react';

export default function Cart() {
  const { items, totalPrice, removeItem, updateItem } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [updating, setUpdating] = useState<string | null>(null);

  const handleUpdateQuantity = async (productId: string, quantity: number) => {
    try {
      setUpdating(productId);
      await updateItem(productId, quantity);
    } catch (error: any) {
      showToast(error.response?.data?.error || 'Failed to update cart', 'error');
    } finally {
      setUpdating(null);
    }
  };

  const handleRemove = async (productId: string) => {
    try {
      await removeItem(productId);
      showToast('Item removed from cart', 'success');
    } catch (error: any) {
      showToast(error.response?.data?.error || 'Failed to remove item', 'error');
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      showToast('Please login to checkout', 'info');
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Please login to view your cart
          </h1>
          <Link
            to="/login"
            className="inline-block px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Your cart is empty
          </h1>
          <p className="text-gray-600 mb-8">Add some products to get started!</p>
          <Link
            to="/products"
            className="inline-block px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item._id}
                  className="flex gap-4 bg-white p-6 rounded-lg shadow"
                >
                  <div className="w-24 h-24 bg-gray-200 rounded flex-shrink-0 flex items-center justify-center overflow-hidden">
                    {getProductImageUrl(item.product.images) ? (
                      <img
                        src={getProductImageUrl(item.product.images)!}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-400 text-sm">No image</span>
                    )}
                  </div>

                  <div className="flex-1">
                    <Link
                      to={`/product/${item.product._id}`}
                      className="text-lg font-bold text-gray-900 hover:text-blue-600 transition"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-blue-600 font-bold mt-1">
                      {formatPrice(item.price)}
                    </p>
                    <div className="flex items-center space-x-2 mt-3">
                      <button
                        onClick={() =>
                          handleUpdateQuantity(item.product._id, item.quantity - 1)
                        }
                        disabled={updating === item.product._id}
                        className="p-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center font-bold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleUpdateQuantity(item.product._id, item.quantity + 1)
                        }
                        disabled={updating === item.product._id}
                        className="p-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                    <button
                      onClick={() => handleRemove(item.product._id)}
                      className="mt-4 text-red-600 hover:text-red-800 flex items-center space-x-1 ml-auto"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="bg-white p-6 rounded-lg shadow sticky top-20">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6 pb-6 border-b">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-bold">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span className="font-bold">Free</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax</span>
                  <span className="font-bold">{formatPrice(0)}</span>
                </div>
              </div>

              <div className="flex justify-between text-xl font-bold text-gray-900 mb-6">
                <span>Total</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition mb-3"
              >
                Proceed to Checkout
              </button>
              <Link
                to="/products"
                className="block text-center px-6 py-3 bg-gray-200 text-gray-900 font-bold rounded-lg hover:bg-gray-300 transition"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
