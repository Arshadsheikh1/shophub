// import AdminSidebar from './AdminSidebar';
// import { useAuth } from '../../context/AuthContext';
// import { useNavigate } from 'react-router-dom';
// import { useEffect } from 'react';

// export default function AdminLayout({ children }: { children: React.ReactNode }) {
//   const { user, isLoading } = useAuth();
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!isLoading && (!user || user.role !== 'admin')) {
//       navigate('/');
//     }
//   }, [user, isLoading, navigate]);

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   if (!user || user.role !== 'admin') {
//     return null;
//   }

//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       <AdminSidebar />
//       <main className="flex-1 md:ml-0 mt-16 md:mt-0">
//         <div className="p-8">{children}</div>
//       </main>
//     </div>
//   );
// }



// import { Outlet, Link } from 'react-router-dom';

// export default function AdminLayout() {
//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       {/* ===== SIDEBAR ===== */}
//       <aside className="w-64 bg-white shadow-md">
//         <div className="p-4 text-xl font-bold border-b">
//           Admin Panel
//         </div>

//         <nav className="p-4 space-y-2">
//           <Link
//             to="/admin"
//             className="block px-3 py-2 rounded hover:bg-gray-200"
//           >
//             Dashboard
//           </Link>

//           <Link
//             to="/admin/products"
//             className="block px-3 py-2 rounded hover:bg-gray-200"
//           >
//             Products
//           </Link>

//           <Link
//             to="/admin/products/new"
//             className="block px-3 py-2 rounded hover:bg-gray-200"
//           >
//             Add Product
//           </Link>

//           <Link
//             to="/admin/orders"
//             className="block px-3 py-2 rounded hover:bg-gray-200"
//           >
//             Orders
//           </Link>
//         </nav>
//       </aside>

//       {/* ===== MAIN CONTENT ===== */}
//       <main className="flex-1 p-6">
//         <Outlet />
//       </main>
//     </div>
//   );
// }

import { Outlet, Link, useLocation } from 'react-router-dom';

export default function AdminLayout() {
  const location = useLocation();

  const isActive = (path: string) =>
    location.pathname === path
      ? 'bg-blue-600 text-white'
      : 'hover:bg-gray-200';

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* ===== SIDEBAR ===== */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4 text-xl font-bold border-b">
          Admin Panel
        </div>

        <nav className="p-4 space-y-2">
          <Link
            to="/admin"
            className={`block px-3 py-2 rounded ${isActive('/admin')}`}
          >
            Dashboard
          </Link>

          <Link
            to="/admin/products"
            className={`block px-3 py-2 rounded ${isActive('/admin/products')}`}
          >
            Products
          </Link>

          <Link
            to="/admin/products/new"
            className={`block px-3 py-2 rounded ${isActive('/admin/products/new')}`}
          >
            Add Product
          </Link>

          {/* ✅ NEW: CATEGORIES TAB */}
          <Link
            to="/admin/categories"
            className={`block px-3 py-2 rounded ${isActive('/admin/categories')}`}
          >
            Categories
          </Link>

          <Link
            to="/admin/orders"
            className={`block px-3 py-2 rounded ${isActive('/admin/orders')}`}
          >
            Orders
          </Link>
        </nav>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}

