import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import client, { apiErrorMessage } from '../api/client';

export default function ItemPrices() {
  const { category, itemId } = useParams();
  const [itemName, setItemName] = useState('');
  const [prices, setPrices] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedMarket, setSelectedMarket] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyError, setHistoryError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    Promise.all([
      client.get('/items', { params: { category } }),
      client.get('/prices', { params: { item: itemId } }),
    ])
      .then(([itemsRes, pricesRes]) => {
        const match = itemsRes.data.find((i) => i._id === itemId);
        setItemName(match ? match.name : 'Item');
        setPrices(pricesRes.data);
      })
      .catch((err) => setError(apiErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [category, itemId]);

  useEffect(() => {
    if (!selectedMarket) return;
    setHistoryError('');
    client
      .get('/prices/history', { params: { item: itemId, market: selectedMarket } })
      .then((res) => setHistory(res.data))
      .catch((err) => setHistoryError(apiErrorMessage(err)));
  }, [selectedMarket, itemId]);

  const chartData = history.map((h) => ({
    date: new Date(h.dateSubmitted).toLocaleDateString(),
    price: h.price,
  }));

  return (
    <div className="page">
      <Link to={`/items/${category}`}>&larr; {category} Items</Link>
      <h1>{itemName} — Current Prices</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && prices.length === 0 && <p>No approved prices yet for this item.</p>}

      {!loading && !error && prices.length > 0 && (
        <table className="price-table">
          <thead>
            <tr>
              <th>Market</th>
              <th>Region</th>
              <th>Price</th>
              <th>Last Updated</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {prices.map((p) => (
              <tr key={p._id}>
                <td>{p.market.name}</td>
                <td>{p.market.region}</td>
                <td>{p.price}</td>
                <td>{new Date(p.dateSubmitted).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => setSelectedMarket(p.market._id)}>View History</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedMarket && (
        <div className="history-section">
          <h2>Price History</h2>
          {historyError && <p className="error">{historyError}</p>}
          {!historyError && chartData.length > 0 && (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="price" stroke="#1a7f37" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          )}
          {!historyError && chartData.length === 0 && <p>No history yet for this market.</p>}
          <ul className="history-list">
            {history.map((h) => (
              <li key={h._id}>
                {new Date(h.dateSubmitted).toLocaleDateString()}: {h.price}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
