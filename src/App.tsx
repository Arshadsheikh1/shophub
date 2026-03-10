// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { AuthProvider, useAuth } from './context/AuthContext';
// import { CartProvider } from './context/CartContext';
// import Navbar from './components/Navbar';
// import Footer from './components/Footer';
// import Toast from './components/Toast';

// import Home from './pages/Home';
// import Products from './pages/Products';
// import ProductDetail from './pages/ProductDetail';
// import Cart from './pages/Cart';
// import Checkout from './pages/Checkout';
// import Login from './pages/Login';
// import Register from './pages/Register';
// import Orders from './pages/Orders';

// import AdminLayout from './components/admin/AdminLayout';
// import AdminDashboard from './pages/admin/AdminDashboard';
// import AdminProducts from './pages/admin/AdminProducts';
// import AdminProductForm from './pages/admin/AdminProductForm';
// import AdminOrders from './pages/admin/AdminOrders';
// import AdminOrderDetail from './pages/admin/AdminOrderDetail';

// function ProtectedRoute({ children }: { children: React.ReactNode }) {
//   const { isAuthenticated, isLoading } = useAuth();

//   if (isLoading) {
//     return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
//   }

//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }

//   return <>{children}</>;
// }

// function AdminRoute({ children }: { children: React.ReactNode }) {
//   const { isAuthenticated, isLoading, user } = useAuth();

//   if (isLoading) {
//     return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
//   }

//   if (!isAuthenticated || user?.role !== 'admin') {
//     return <Navigate to="/" replace />;
//   }

//   return <AdminLayout>{children}</AdminLayout>;
// }

// function AppContent() {
//   return (
//     <div className="flex flex-col min-h-screen">
//       <Navbar />
//       <main className="flex-grow">
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/products" element={<Products />} />
//           <Route path="/product/:id" element={<ProductDetail />} />
//           <Route path="/cart" element={<Cart />} />
//           <Route
//             path="/checkout"
//             element={
//               <ProtectedRoute>
//                 <Checkout />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/orders"
//             element={
//               <ProtectedRoute>
//                 <Orders />
//               </ProtectedRoute>
//             }
//           />
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />

//           <Route
//             path="/admin"
//             element={
//               <AdminRoute>
//                 <AdminDashboard />
//               </AdminRoute>
//             }
//           />
//           <Route
//             path="/admin/products"
//             element={
//               <AdminRoute>
//                 <AdminProducts />
//               </AdminRoute>
//             }
//           />
//           <Route
//             path="/admin/products/new"
//             element={
//               <AdminRoute>
//                 <AdminProductForm />
//               </AdminRoute>
//             }
//           />
//           <Route
//             path="/admin/products/edit/:id"
//             element={
//               <AdminRoute>
//                 <AdminProductForm />
//               </AdminRoute>
//             }
//           />
//           <Route
//             path="/admin/orders"
//             element={
//               <AdminRoute>
//                 <AdminOrders />
//               </AdminRoute>
//             }
//           />
//           <Route
//             path="/admin/orders/:id"
//             element={
//               <AdminRoute>
//                 <AdminOrderDetail />
//               </AdminRoute>
//             }
//           />
//         </Routes>
//       </main>
//       <Footer />
//       <Toast />
//     </div>
//   );
// }

// function App() {
//   return (
//     <Router>
//       <AuthProvider>
//         <CartProvider>
//           <AppContent />
//         </CartProvider>
//       </AuthProvider>
//     </Router>
//   );
// }

// export default App;

// 


import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';

import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Orders from './pages/Orders';

import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminProductForm from './pages/admin/AdminProductForm';
import AdminOrders from './pages/admin/AdminOrders';
import AdminOrderDetail from './pages/admin/AdminOrderDetail';
import AdminLogin from './pages/admin/AdminLogin';
import AdminCategories from './pages/admin/AdminCategories'; // ✅ NEW

/* ================= USER PROTECTED ================= */
function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

/* ================= ADMIN PROTECTED ================= */
function AdminRoute() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

function AppContent() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          {/* ===== PUBLIC ROUTES ===== */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* 👑 ADMIN LOGIN (PUBLIC) */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* ===== USER PROTECTED ===== */}
          <Route element={<ProtectedRoute />}>
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<Orders />} />
          </Route>

          {/* ===== ADMIN PROTECTED ===== */}
          <Route element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/products" element={<AdminProducts />} />
              <Route path="/admin/products/new" element={<AdminProductForm />} />
              <Route path="/admin/products/edit/:id" element={<AdminProductForm />} />

              {/* ✅ CATEGORY ROUTE */}
              <Route path="/admin/categories" element={<AdminCategories />} />

              <Route path="/admin/orders" element={<AdminOrders />} />
              <Route path="/admin/orders/:id" element={<AdminOrderDetail />} />
            </Route>
          </Route>
        </Routes>
      </main>
      <Footer />
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}
