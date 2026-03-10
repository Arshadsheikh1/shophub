import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import StatCard from '../../components/admin/StatCard';
import { Users, Package, ShoppingCart, DollarSign, Loader } from 'lucide-react';
import { formatPrice } from '../../utils/format';
import { showToast } from '../../utils/toast';

interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  recentOrders: any[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await adminAPI.dashboard();
        setStats(response.data.data);
      } catch (error: any) {
        const message = error.response?.data?.error || 'Failed to fetch dashboard stats';
        showToast(message, 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={Users}
          label="Total Users"
          value={stats?.totalUsers || 0}
          color="blue"
        />
        <StatCard
          icon={Package}
          label="Total Products"
          value={stats?.totalProducts || 0}
          color="green"
        />
        <StatCard
          icon={ShoppingCart}
          label="Total Orders"
          value={stats?.totalOrders || 0}
          color="orange"
        />
        <StatCard
          icon={DollarSign}
          label="Total Revenue"
          value={formatPrice(stats?.totalRevenue || 0)}
          color="red"
        />
      </div>

      {stats?.recentOrders && stats.recentOrders.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left font-bold text-gray-700">Order ID</th>
                  <th className="px-6 py-3 text-left font-bold text-gray-700">Customer</th>
                  <th className="px-6 py-3 text-left font-bold text-gray-700">Amount</th>
                  <th className="px-6 py-3 text-left font-bold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order) => (
                  <tr key={order._id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4">{order.orderNumber}</td>
                    <td className="px-6 py-4">{order.customerName}</td>
                    <td className="px-6 py-4 font-bold">{formatPrice(order.totalAmount)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        order.orderStatus === 'delivered'
                          ? 'bg-green-100 text-green-800'
                          : order.orderStatus === 'shipped'
                          ? 'bg-blue-100 text-blue-800'
                          : order.orderStatus === 'processing'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {order.orderStatus}
                      </span>
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
