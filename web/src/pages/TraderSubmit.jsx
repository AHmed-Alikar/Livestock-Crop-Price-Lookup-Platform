import { useEffect, useState } from 'react';
import client, { apiErrorMessage } from '../api/client';

export default function TraderSubmit() {
  const [items, setItems] = useState([]);
  const [markets, setMarkets] = useState([]);
  const [form, setForm] = useState({ item: '', market: '', price: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([client.get('/items'), client.get('/markets')]).then(([itemsRes, marketsRes]) => {
      setItems(itemsRes.data);
      setMarkets(marketsRes.data);
    });
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);
    try {
      await client.post('/price-entries', {
        item: form.item,
        market: form.market,
        price: Number(form.price),
      });
      setSuccess('Submitted! Your entry is pending admin approval.');
      setForm({ item: '', market: '', price: '' });
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page narrow">
      <h1>Submit New Price Entry</h1>
      <form onSubmit={handleSubmit} className="form">
        <label>
          Item
          <select required value={form.item} onChange={(e) => setForm({ ...form, item: e.target.value })}>
            <option value="">Select an item</option>
            {items.map((i) => (
              <option key={i._id} value={i._id}>{i.name} ({i.category})</option>
            ))}
          </select>
        </label>
        <label>
          Market
          <select required value={form.market} onChange={(e) => setForm({ ...form, market: e.target.value })}>
            <option value="">Select a market</option>
            {markets.map((m) => (
              <option key={m._id} value={m._id}>{m.name} ({m.region})</option>
            ))}
          </select>
        </label>
        <label>
          Price
          <input required type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
        </label>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <button type="submit" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit'}</button>
      </form>
    </div>
  );
}
