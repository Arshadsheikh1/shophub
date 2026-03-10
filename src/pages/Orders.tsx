import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../services/api';
import { formatPrice, formatDate, getStatusColor } from '../utils/format';
import { Loader, Package } from 'lucide-react';

interface Order {
  _id: string;
  orderNumber: string;
  totalAmount: number;
  orderStatus: string;
  paymentStatus: string;
  createdAt: string;
  items: any[];
}

export default function Orders() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const params = filter ? { status: filter } : undefined;
        const response = await orderAPI.getUserOrders(params);
        setOrders(response.data.data || []);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, navigate, filter]);

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            You haven't placed any orders yet
          </h1>
          <button
            onClick={() => navigate('/products')}
            className="inline-block px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

        <div className="mb-6 flex space-x-2">
          <button
            onClick={() => setFilter('')}
            className={`px-4 py-2 rounded font-medium transition ${
              filter === ''
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-500'
            }`}
          >
            All Orders
          </button>
          {['pending', 'processing', 'shipped', 'delivered'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded font-medium transition capitalize ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-500'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4 pb-4 border-b">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Order {order.orderNumber}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {formatDate(order.createdAt)}
                  </p>
                </div>
                <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
                    {order.orderStatus}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.paymentStatus)}`}>
                    {order.paymentStatus}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-gray-700 font-bold mb-2">Items ({order.items.length}):</p>
                <ul className="space-y-2">
                  {order.items.slice(0, 3).map((item: any, idx: number) => (
                    <li key={idx} className="text-gray-600 text-sm">
                      {item.name} × {item.quantity} = {formatPrice(item.subtotal)}
                    </li>
                  ))}
                  {order.items.length > 3 && (
                    <li className="text-gray-600 text-sm">
                      +{order.items.length - 3} more item(s)
                    </li>
                  )}
                </ul>
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <div>
                  <p className="text-gray-700 text-sm">Total</p>
                  <p className="text-xl font-bold text-gray-900">
                    {formatPrice(order.totalAmount)}
                  </p>
                </div>
                <button
                  onClick={() => navigate(`/orders/${order._id}`)}
                  className="px-6 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
