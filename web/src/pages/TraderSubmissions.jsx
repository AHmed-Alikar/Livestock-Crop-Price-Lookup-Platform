import { useEffect, useState } from 'react';
import client, { apiErrorMessage } from '../api/client';
import StatusBadge from '../components/StatusBadge';

export default function TraderSubmissions() {
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client
      .get('/price-entries/mine')
      .then((res) => setEntries(res.data))
      .catch((err) => setError(apiErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page">
      <h1>My Submissions</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && entries.length === 0 && <p>You haven't submitted any prices yet.</p>}
      {!loading && !error && entries.length > 0 && (
        <table className="price-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Market</th>
              <th>Price</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e) => (
              <tr key={e._id}>
                <td>{e.item?.name}</td>
                <td>{e.market?.name}</td>
                <td>{e.price}</td>
                <td>{new Date(e.dateSubmitted).toLocaleDateString()}</td>
                <td><StatusBadge status={e.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
