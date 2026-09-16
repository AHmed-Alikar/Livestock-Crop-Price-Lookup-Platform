import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import client, { apiErrorMessage } from '../api/client';

export default function ItemPrices() {
  const { category, itemId } = useParams();
  const [itemName, setItemName] = useState('');
  const [prices, setPrices] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

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
            </tr>
          </thead>
          <tbody>
            {prices.map((p) => (
              <tr key={p._id}>
                <td>{p.market.name}</td>
                <td>{p.market.region}</td>
                <td>{p.price}</td>
                <td>{new Date(p.dateSubmitted).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
