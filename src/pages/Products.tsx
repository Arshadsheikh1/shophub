import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { productAPI } from '../services/api';
import { formatPrice, getProductImageUrl } from '../utils/format';
import { Loader } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  price: number;
  discountPrice?: number;
  images?: Array<{ path?: string; filename?: string }>;
  stock: number;
}

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const search = searchParams.get('search') || '';
  const categoryId = searchParams.get('category') || '';

  // Reset to page 1 when category or search changes
  useEffect(() => {
    setPage(1);
  }, [categoryId, search]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const params: any = { limit: 12, page };
        if (search) params.search = search;
        if (categoryId) params.category = categoryId;

        const [productsRes, categoriesRes] = await Promise.all([
          productAPI.getProducts(params),
          productAPI.getCategories(),
        ]);

        setProducts(productsRes.data.data || []);
        setTotal(productsRes.data.total || 0);
        setCategories(categoriesRes.data.data || []);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [search, categoryId, page]);

  const totalPages = Math.ceil(total / 12);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Products</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <aside className="md:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Categories</h2>
              <div className="space-y-2">
                <Link
                  to="/products"
                  className={`block px-4 py-2 rounded ${
                    !categoryId
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  All Products
                </Link>
                {categories.map((cat: any) => (
                  <Link
                    key={cat._id}
                    to={`/products?category=${cat._id}`}
                    className={`block px-4 py-2 rounded ${
                      categoryId === cat._id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          </aside>

          <main className="md:col-span-3">
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No products found</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {products.map((product) => (
                    <Link
                      key={product._id}
                      to={`/product/${product._id}`}
                      className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden group"
                    >
                      <div className="bg-gray-200 h-48 flex items-center justify-center overflow-hidden">
                        {getProductImageUrl(product.images) ? (
                          <img
                            src={getProductImageUrl(product.images)!}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition"
                          />
                        ) : (
                          <span className="text-gray-400">No image</span>
                        )}
                        {product.stock === 0 && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="text-white font-bold">Out of Stock</span>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-bold text-gray-900 line-clamp-2 mb-2">
                          {product.name}
                        </h3>
                        <div className="flex items-center space-x-2 mb-2">
                          {product.discountPrice ? (
                            <>
                              <span className="text-lg font-bold text-blue-600">
                                {formatPrice(product.discountPrice)}
                              </span>
                              <span className="text-sm text-gray-500 line-through">
                                {formatPrice(product.price)}
                              </span>
                            </>
                          ) : (
                            <span className="text-lg font-bold text-gray-900">
                              {formatPrice(product.price)}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`px-4 py-2 rounded ${
                          page === p
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
