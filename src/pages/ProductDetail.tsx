import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice, getProductImageUrl } from '../utils/format';
import { showToast } from '../utils/toast';
import { Loader, Minus, Plus, ShoppingCart } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  price: number;
  discountPrice?: number;
  description?: string;
  stock: number;
  images?: Array<{ path?: string; filename?: string }>;
  sku?: string;
  category?: string;
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await productAPI.getProductById(id!);
        setProduct(response.data.data);
      } catch (error) {
        console.error('Failed to fetch product:', error);
        showToast('Product not found', 'error');
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, navigate]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      showToast('Please login to add items to cart', 'info');
      navigate('/login');
      return;
    }

    if (!product) return;

    try {
      setAdding(true);
      await addItem(product._id, quantity);
      showToast(`${product.name} added to cart!`, 'success');
      setQuantity(1);
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to add to cart';
      showToast(message, 'error');
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Product not found</p>
      </div>
    );
  }

  const discountPercent = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-8 rounded-lg shadow">
          <div>
            <div className="bg-gray-200 h-96 rounded-lg flex items-center justify-center overflow-hidden">
              {getProductImageUrl(product.images) ? (
                <img
                  src={getProductImageUrl(product.images)!}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-400">No image available</span>
              )}
            </div>
            {discountPercent > 0 && (
              <p className="mt-4 text-center text-red-600 font-bold text-lg">
                Save {discountPercent}%
              </p>
            )}
          </div>

          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

            <div className="mb-6">
              {product.sku && (
                <p className="text-gray-600 mb-2">SKU: {product.sku}</p>
              )}
              <div className="flex items-center space-x-4 mb-2">
                {product.discountPrice ? (
                  <>
                    <span className="text-3xl font-bold text-blue-600">
                      {formatPrice(product.discountPrice)}
                    </span>
                    <span className="text-lg text-gray-500 line-through">
                      {formatPrice(product.price)}
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-bold text-gray-900">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>
              <p className={`text-lg font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </p>
            </div>

            {product.description && (
              <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-900 mb-2">Description</h2>
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>
            )}

            {product.stock > 0 && (
              <div className="mb-6">
                <label className="block text-gray-700 font-bold mb-2">Quantity</label>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 bg-gray-200 rounded hover:bg-gray-300 transition"
                  >
                    <Minus className="h-5 w-5" />
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 1;
                      setQuantity(Math.min(Math.max(1, val), product.stock));
                    }}
                    max={product.stock}
                    min={1}
                    className="w-16 text-center border border-gray-300 rounded px-2 py-1"
                  />
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-2 bg-gray-200 rounded hover:bg-gray-300 transition"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0 || adding}
              className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="h-5 w-5" />
              <span>{adding ? 'Adding...' : 'Add to Cart'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
