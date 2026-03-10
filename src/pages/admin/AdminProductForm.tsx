import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import { showToast } from '../../utils/toast';
import { Loader } from 'lucide-react';

interface Category {
  _id: string;
  name: string;
}

export default function AdminProductForm() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [image, setImage] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    stock: '',
    category: '',
  });

  /* =====================
     LOAD CATEGORIES
     ===================== */
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await adminAPI.categories.getAll();
        setCategories(res.data.data || []);
      } catch {
        showToast('Failed to load categories', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  /* =====================
     HANDLERS
     ===================== */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setImage(e.target.files[0]);
    }
  };

  /* =====================
     SUBMIT
     ===================== */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 🔥 STRICT VALIDATION (MATCHES BACKEND)
    if (
      !formData.name ||
      !formData.price ||
      !formData.description ||
      !formData.stock ||
      !formData.category
    ) {
      showToast('All fields are required', 'error');
      return;
    }

    try {
      setSubmitting(true);

      const data = new FormData();
      data.append('name', formData.name);
      data.append('price', formData.price);
      data.append('description', formData.description);
      data.append('stock', formData.stock);
      data.append('category', formData.category);

      if (image) data.append('image', image);

      await adminAPI.products.create(data);

      showToast('Product created successfully', 'success');
      navigate('/admin/products');
    } catch (err: any) {
      console.error(err);
      showToast(
        err.response?.data?.error || 'Failed to save product',
        'error'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-xl bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Add Product</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          placeholder="Product name"
          className="w-full border p-2"
          onChange={handleChange}
        />

        <input
          name="price"
          type="number"
          placeholder="Price"
          className="w-full border p-2"
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="Description"
          className="w-full border p-2"
          onChange={handleChange}
        />

        <input
          name="stock"
          type="number"
          placeholder="Stock"
          className="w-full border p-2"
          onChange={handleChange}
        />

        <select
          name="category"
          className="w-full border p-2"
          onChange={handleChange}
        >
          <option value="">Select category</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        <input type="file" onChange={handleImageChange} />

        <button
          disabled={submitting}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {submitting ? 'Saving...' : 'Create Product'}
        </button>
      </form>
    </div>
  );
}

