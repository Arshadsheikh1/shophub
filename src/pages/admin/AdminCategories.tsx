import { useEffect, useState } from 'react';
import { adminAPI } from '../../services/api';
import { showToast } from '../../utils/toast';
import { Loader } from 'lucide-react';

interface Category {
  _id: string;
  name: string;
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await adminAPI.categories.getAll();
      setCategories(res.data.data || []);
    } catch (error: any) {
      showToast('Failed to load categories', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      showToast('Category name is required', 'error');
      return;
    }

    try {
      setSubmitting(true);
      await adminAPI.categories.create({ name });
      showToast('Category created successfully', 'success');
      setName('');
      fetchCategories();
    } catch (error: any) {
      showToast(error.response?.data?.error || 'Failed to create category', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Categories</h1>

      {/* ===== CREATE CATEGORY ===== */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow mb-8 max-w-md"
      >
        <label className="block font-bold mb-2">New Category</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Category name"
            className="flex-1 border px-3 py-2 rounded"
          />
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? 'Saving...' : 'Add'}
          </button>
        </div>
      </form>

      {/* ===== CATEGORY LIST ===== */}
      <div className="bg-white rounded shadow p-6 max-w-md">
        <h2 className="text-xl font-bold mb-4">All Categories</h2>

        {loading ? (
          <div className="flex justify-center py-6">
            <Loader className="animate-spin h-6 w-6 text-blue-600" />
          </div>
        ) : categories.length === 0 ? (
          <p className="text-gray-500">No categories found</p>
        ) : (
          <ul className="space-y-2">
            {categories.map((cat) => (
              <li
                key={cat._id}
                className="border px-3 py-2 rounded bg-gray-50"
              >
                {cat.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
