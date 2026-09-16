import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import NavBar from './components/NavBar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import ItemList from './pages/ItemList';
import ItemPrices from './pages/ItemPrices';
import TraderSignup from './pages/TraderSignup';
import Login from './pages/Login';
import TraderSubmit from './pages/TraderSubmit';
import TraderSubmissions from './pages/TraderSubmissions';
import AdminQueue from './pages/AdminQueue';
import AdminManage from './pages/AdminManage';

export default function App() {
  return (
    <AuthProvider>
      <NavBar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/items/:category" element={<ItemList />} />
          <Route path="/items/:category/:itemId" element={<ItemPrices />} />

          <Route path="/trader/signup" element={<TraderSignup />} />
          <Route path="/trader/login" element={<Login role="trader" />} />
          <Route
            path="/trader/submit"
            element={
              <ProtectedRoute role="trader">
                <TraderSubmit />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trader/submissions"
            element={
              <ProtectedRoute role="trader">
                <TraderSubmissions />
              </ProtectedRoute>
            }
          />

          <Route path="/admin/login" element={<Login role="admin" />} />
          <Route
            path="/admin/queue"
            element={
              <ProtectedRoute role="admin">
                <AdminQueue />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/manage"
            element={
              <ProtectedRoute role="admin">
                <AdminManage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Home />} />
        </Routes>
      </main>
    </AuthProvider>
  );
}
