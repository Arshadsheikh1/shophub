import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import { formatPrice, getProductImageUrl } from '../../utils/format';
import { showToast } from '../../utils/toast';
import { Loader, Plus, Edit2, Trash2, Search } from 'lucide-react';

interface Category {
  _id: string;
  name: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  discountPrice?: number;
  category?: Category;
  stock: number;
  images?: {
    filename: string;
    path: string;
  }[];
}

export default function AdminProducts() {

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await adminAPI.products.getAll();

      setProducts(response.data.data || []);

    } catch (error: any) {

      const message =
        error.response?.data?.error || 'Failed to fetch products';

      showToast(message, 'error');

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleDelete = async (id: string) => {

    if (!confirm('Are you sure you want to delete this product?')) return;

    try {

      setDeleting(id);

      await adminAPI.products.delete(id);

      setProducts(prev => prev.filter(p => p._id !== id));

      showToast('Product deleted successfully', 'success');

    } catch (error: any) {

      const message =
        error.response?.data?.error || 'Failed to delete product';

      showToast(message, 'error');

    } finally {
      setDeleting(null);
    }
  };

  return (

    <div>

      {/* HEADER */}

      <div className="flex justify-between items-center mb-8">

        <h1 className="text-3xl font-bold text-gray-900">Products</h1>

        <Link
          to="/admin/products/new"
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
        >
          <Plus className="h-5 w-5" />
          <span>Add Product</span>
        </Link>

      </div>


      {/* SEARCH */}

      <div className="bg-white p-6 rounded-lg shadow mb-6">

        <form onSubmit={handleSearch} className="flex space-x-2">

          <div className="flex-1 relative">

            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />

            <button type="submit" className="absolute right-3 top-2.5">

              <Search className="h-5 w-5 text-gray-400" />

            </button>

          </div>

        </form>

      </div>


      {/* CONTENT */}

      {loading ? (

        <div className="flex justify-center py-12">
          <Loader className="h-8 w-8 animate-spin text-blue-600" />
        </div>

      ) : products.length === 0 ? (

        <div className="text-center py-12">
          <p className="text-gray-600">No products found</p>
        </div>

      ) : (

        <div className="bg-white rounded-lg shadow overflow-hidden">

          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              <thead className="bg-gray-50 border-b">

                <tr>

                  <th className="px-6 py-4 text-left font-bold text-gray-700">Product</th>
                  <th className="px-6 py-4 text-left font-bold text-gray-700">Price</th>
                  <th className="px-6 py-4 text-left font-bold text-gray-700">Stock</th>
                  <th className="px-6 py-4 text-left font-bold text-gray-700">Category</th>
                  <th className="px-6 py-4 text-left font-bold text-gray-700">Actions</th>

                </tr>

              </thead>

              <tbody>

                {products.map((product) => (

                  <tr key={product._id} className="border-t hover:bg-gray-50">

                    {/* PRODUCT */}

                    <td className="px-6 py-4">

                      <div className="flex items-center space-x-3">

                        {getProductImageUrl(product.images) && (

                          <img
                            src={getProductImageUrl(product.images)!}
                            alt={product.name}
                            className="h-10 w-10 rounded object-cover"
                          />

                        )}

                        <span className="font-medium text-gray-900">
                          {product.name}
                        </span>

                      </div>

                    </td>


                    {/* PRICE */}

                    <td className="px-6 py-4">

                      <p className="font-bold text-gray-900">
                        {formatPrice(product.price)}
                      </p>

                    </td>


                    {/* STOCK */}

                    <td className="px-6 py-4">

                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        product.stock > 0
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>

                        {product.stock}

                      </span>

                    </td>


                    {/* CATEGORY (FIXED) */}

                    <td className="px-6 py-4 text-gray-600">

                      {product.category?.name || 'N/A'}

                    </td>


                    {/* ACTIONS */}

                    <td className="px-6 py-4">

                      <div className="flex space-x-2">

                        <Link
                          to={`/admin/products/edit/${product._id}`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                        >
                          <Edit2 className="h-5 w-5" />
                        </Link>

                        <button
                          onClick={() => handleDelete(product._id)}
                          disabled={deleting === product._id}
                          className="p-2 text-red-600 hover:bg-red-50 rounded transition disabled:opacity-50"
                        >
                          {deleting === product._id
                            ? <Loader className="h-5 w-5 animate-spin"/>
                            : <Trash2 className="h-5 w-5"/>}
                        </button>

                      </div>

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
