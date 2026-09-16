import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import ItemList from './pages/ItemList';
import ItemPrices from './pages/ItemPrices';

export default function App() {
  return (
    <>
      <NavBar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/items/:category" element={<ItemList />} />
          <Route path="/items/:category/:itemId" element={<ItemPrices />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
    </>
  );
}
