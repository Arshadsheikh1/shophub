import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import { formatPrice, formatDate } from '../../utils/format';
import { showToast } from '../../utils/toast';
import { Loader, ArrowLeft, RefreshCw } from 'lucide-react';

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

interface OrderDetail {
  _id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
  };
  totalAmount: number;
  orderStatus: string;
  paymentStatus: string;
  paymentMethod: string;
  createdAt: string;
  notes?: string;
}

export default function AdminOrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await adminAPI.orders.getById(id!);
        setOrder(response.data.data);
      } catch (error: any) {
        const message = error.response?.data?.error || 'Failed to fetch order';
        showToast(message, 'error');
        navigate('/admin/orders');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id, navigate]);

  const handleStatusChange = async (newStatus: string) => {
    if (!order) return;

    try {
      setUpdating(true);
      await adminAPI.orders.updateStatus(order._id, newStatus);
      setOrder({ ...order, orderStatus: newStatus });
      showToast('Order status updated successfully', 'success');
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to update order status';
      showToast(message, 'error');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Order not found</p>
      </div>
    );
  }

  const statusOptions = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

  return (
    <div>
      <div className="flex items-center space-x-4 mb-8">
        <button
          onClick={() => navigate('/admin/orders')}
          className="p-2 hover:bg-gray-200 rounded-lg transition"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Order {order.orderNumber}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Status</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Order Status:</span>
                <select
                  value={order.orderStatus}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  disabled={updating}
                  className={`px-4 py-2 rounded font-bold capitalize border-0 ${
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
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Payment Status:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-bold capitalize ${
                  order.paymentStatus === 'paid'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {order.paymentStatus}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Payment Method:</span>
                <span className="font-bold capitalize">{order.paymentMethod}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Order Date:</span>
                <span className="font-bold">{formatDate(order.createdAt)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Customer Information</h2>
            <div className="space-y-2 text-gray-700">
              <p><span className="font-bold">Name:</span> {order.customerName}</p>
              <p><span className="font-bold">Email:</span> {order.customerEmail}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Shipping Address</h2>
            <div className="text-gray-700">
              <p>{order.shippingAddress.street}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
              <p>{order.shippingAddress.country}</p>
              <p className="mt-2"><span className="font-bold">Phone:</span> {order.shippingAddress.phone}</p>
            </div>
          </div>

          {order.notes && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Notes</h2>
              <p className="text-gray-700">{order.notes}</p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-start pb-4 border-b last:border-b-0">
                  <div>
                    <p className="font-bold text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-bold text-gray-900">{formatPrice(item.subtotal)}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-bold">{formatPrice(order.totalAmount)}</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-gray-600">Shipping:</span>
                <span className="font-bold">Free</span>
              </div>
              <div className="flex justify-between items-center mt-4 pt-4 border-t text-lg">
                <span className="font-bold">Total:</span>
                <span className="font-bold text-blue-600">{formatPrice(order.totalAmount)}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/admin/orders')}
            className="w-full px-6 py-3 bg-gray-200 text-gray-900 font-bold rounded-lg hover:bg-gray-300 transition"
          >
            Back to Orders
          </button>
        </div>
      </div>
    </div>
  );
}
