import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import client, { apiErrorMessage } from '../api/client';

export default function ItemList() {
  const { category } = useParams();
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setError('');
    client
      .get('/items', { params: { category } })
      .then((res) => setItems(res.data))
      .catch((err) => setError(apiErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <div className="page">
      <Link to="/">&larr; Categories</Link>
      <h1>{category} Items</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      <ul className="item-list">
        {items.map((item) => (
          <li key={item._id}>
            <Link to={`/items/${category}/${item._id}`}>{item.name}</Link>
          </li>
        ))}
      </ul>
      {!loading && !error && items.length === 0 && <p>No items in this category yet.</p>}
    </div>
  );
}
