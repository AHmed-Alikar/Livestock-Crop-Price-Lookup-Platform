import { useEffect, useState } from 'react';
import client, { apiErrorMessage } from '../api/client';

export default function AdminManage() {
  const [items, setItems] = useState([]);
  const [markets, setMarkets] = useState([]);
  const [error, setError] = useState('');

  const [newItem, setNewItem] = useState({ name: '', category: 'Livestock' });
  const [newMarket, setNewMarket] = useState({ name: '', region: '' });
  const [editingItem, setEditingItem] = useState(null);
  const [editingMarket, setEditingMarket] = useState(null);

  function loadAll() {
    Promise.all([client.get('/items'), client.get('/markets')])
      .then(([itemsRes, marketsRes]) => {
        setItems(itemsRes.data);
        setMarkets(marketsRes.data);
      })
      .catch((err) => setError(apiErrorMessage(err)));
  }

  useEffect(loadAll, []);

  async function addItem(e) {
    e.preventDefault();
    setError('');
    try {
      await client.post('/admin/items', newItem);
      setNewItem({ name: '', category: 'Livestock' });
      loadAll();
    } catch (err) {
      setError(apiErrorMessage(err));
    }
  }

  async function saveItem(item) {
    setError('');
    try {
      await client.patch(`/admin/items/${item._id}`, { name: item.name, category: item.category });
      setEditingItem(null);
      loadAll();
    } catch (err) {
      setError(apiErrorMessage(err));
    }
  }

  async function deleteItem(id) {
    setError('');
    try {
      await client.delete(`/admin/items/${id}`);
      loadAll();
    } catch (err) {
      setError(apiErrorMessage(err));
    }
  }

  async function addMarket(e) {
    e.preventDefault();
    setError('');
    try {
      await client.post('/admin/markets', newMarket);
      setNewMarket({ name: '', region: '' });
      loadAll();
    } catch (err) {
      setError(apiErrorMessage(err));
    }
  }

  async function saveMarket(market) {
    setError('');
    try {
      await client.patch(`/admin/markets/${market._id}`, { name: market.name, region: market.region });
      setEditingMarket(null);
      loadAll();
    } catch (err) {
      setError(apiErrorMessage(err));
    }
  }

  async function deleteMarket(id) {
    setError('');
    try {
      await client.delete(`/admin/markets/${id}`);
      loadAll();
    } catch (err) {
      setError(apiErrorMessage(err));
    }
  }

  return (
    <div className="page">
      <h1>Manage Items &amp; Markets</h1>
      {error && <p className="error">{error}</p>}

      <section>
        <h2>Items</h2>
        <form onSubmit={addItem} className="inline-form">
          <input required placeholder="Name" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} />
          <select value={newItem.category} onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}>
            <option value="Livestock">Livestock</option>
            <option value="Crop">Crop</option>
          </select>
          <button type="submit">Add Item</button>
        </form>
        <table className="price-table">
          <thead><tr><th>Name</th><th>Category</th><th></th></tr></thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id}>
                {editingItem?._id === item._id ? (
                  <>
                    <td><input value={editingItem.name} onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })} /></td>
                    <td>
                      <select value={editingItem.category} onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}>
                        <option value="Livestock">Livestock</option>
                        <option value="Crop">Crop</option>
                      </select>
                    </td>
                    <td className="actions">
                      <button onClick={() => saveItem(editingItem)}>Save</button>
                      <button onClick={() => setEditingItem(null)}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{item.name}</td>
                    <td>{item.category}</td>
                    <td className="actions">
                      <button onClick={() => setEditingItem(item)}>Edit</button>
                      <button className="reject" onClick={() => deleteItem(item._id)}>Delete</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2>Markets</h2>
        <form onSubmit={addMarket} className="inline-form">
          <input required placeholder="Name" value={newMarket.name} onChange={(e) => setNewMarket({ ...newMarket, name: e.target.value })} />
          <input required placeholder="Region" value={newMarket.region} onChange={(e) => setNewMarket({ ...newMarket, region: e.target.value })} />
          <button type="submit">Add Market</button>
        </form>
        <table className="price-table">
          <thead><tr><th>Name</th><th>Region</th><th></th></tr></thead>
          <tbody>
            {markets.map((market) => (
              <tr key={market._id}>
                {editingMarket?._id === market._id ? (
                  <>
                    <td><input value={editingMarket.name} onChange={(e) => setEditingMarket({ ...editingMarket, name: e.target.value })} /></td>
                    <td><input value={editingMarket.region} onChange={(e) => setEditingMarket({ ...editingMarket, region: e.target.value })} /></td>
                    <td className="actions">
                      <button onClick={() => saveMarket(editingMarket)}>Save</button>
                      <button onClick={() => setEditingMarket(null)}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{market.name}</td>
                    <td>{market.region}</td>
                    <td className="actions">
                      <button onClick={() => setEditingMarket(market)}>Edit</button>
                      <button className="reject" onClick={() => deleteMarket(market._id)}>Delete</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
