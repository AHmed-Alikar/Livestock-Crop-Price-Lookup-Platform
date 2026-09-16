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
          <Route path="/trader/login" element={<Login />} />
          <Route
            path="/trader/submit"
            element={
              <ProtectedRoute>
                <TraderSubmit />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trader/submissions"
            element={
              <ProtectedRoute>
                <TraderSubmissions />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Home />} />
        </Routes>
      </main>
    </AuthProvider>
  );
}
