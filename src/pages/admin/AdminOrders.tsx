import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import { formatPrice, formatDate } from '../../utils/format';
import { showToast } from '../../utils/toast';
import { Loader, Eye, RefreshCw } from 'lucide-react';

interface Order {
  _id: string;
  orderNumber: string;
  customerName: string;
  totalAmount: number;
  orderStatus: string;
  paymentStatus: string;
  createdAt: string;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [filter, setFilter] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = filter ? { status: filter } : undefined;
      const response = await adminAPI.orders.getAll(params);
      setOrders(response.data.data || []);
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to fetch orders';
      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      setUpdating(orderId);
      await adminAPI.orders.updateStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus } : o))
      );
      showToast('Order status updated successfully', 'success');
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to update order status';
      showToast(message, 'error');
    } finally {
      setUpdating(null);
    }
  };

  const statusOptions = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
        <button
          onClick={() => fetchOrders()}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
        >
          <RefreshCw className="h-5 w-5" />
          <span>Refresh</span>
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('')}
            className={`px-4 py-2 rounded font-medium transition ${
              filter === ''
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
            }`}
          >
            All Orders
          </button>
          {statusOptions.map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded font-medium capitalize transition ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No orders found</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left font-bold text-gray-700">Order ID</th>
                  <th className="px-6 py-4 text-left font-bold text-gray-700">Customer</th>
                  <th className="px-6 py-4 text-left font-bold text-gray-700">Amount</th>
                  <th className="px-6 py-4 text-left font-bold text-gray-700">Order Status</th>
                  <th className="px-6 py-4 text-left font-bold text-gray-700">Payment</th>
                  <th className="px-6 py-4 text-left font-bold text-gray-700">Date</th>
                  <th className="px-6 py-4 text-left font-bold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4 font-bold text-gray-900">{order.orderNumber}</td>
                    <td className="px-6 py-4">{order.customerName}</td>
                    <td className="px-6 py-4 font-bold">{formatPrice(order.totalAmount)}</td>
                    <td className="px-6 py-4">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        disabled={updating === order._id}
                        className={`px-3 py-1 rounded text-xs font-bold border-0 ${
                          order.orderStatus === 'delivered'
                            ? 'bg-green-100 text-green-800'
                            : order.orderStatus === 'shipped'
                            ? 'bg-blue-100 text-blue-800'
                            : order.orderStatus === 'processing'
                            ? 'bg-yellow-100 text-yellow-800'
                            : order.orderStatus === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        } disabled:opacity-50`}
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        order.paymentStatus === 'paid'
                          ? 'bg-green-100 text-green-800'
                          : order.paymentStatus === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{formatDate(order.createdAt)}</td>
                    <td className="px-6 py-4">
                      <Link
                        to={`/admin/orders/${order._id}`}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded transition inline-block"
                      >
                        <Eye className="h-5 w-5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
