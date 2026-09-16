import { useEffect, useState } from 'react';
import client, { apiErrorMessage } from '../api/client';

export default function AdminQueue() {
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState('');

  function loadQueue() {
    setLoading(true);
    client
      .get('/admin/price-entries', { params: { status: 'pending' } })
      .then((res) => setEntries(res.data))
      .catch((err) => setError(apiErrorMessage(err)))
      .finally(() => setLoading(false));
  }

  useEffect(loadQueue, []);

  async function updateStatus(id, status) {
    setActionError('');
    try {
      await client.patch(`/admin/price-entries/${id}`, { status });
      setEntries((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      setActionError(apiErrorMessage(err));
    }
  }

  return (
    <div className="page">
      <h1>Pending Price Entries</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {actionError && <p className="error">{actionError}</p>}
      {!loading && !error && entries.length === 0 && <p>No pending submissions right now.</p>}
      {!loading && !error && entries.length > 0 && (
        <table className="price-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Market</th>
              <th>Price</th>
              <th>Submitted By</th>
              <th>Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e) => (
              <tr key={e._id}>
                <td>{e.item?.name}</td>
                <td>{e.market?.name}</td>
                <td>{e.price}</td>
                <td>{e.submittedBy?.name} ({e.submittedBy?.email})</td>
                <td>{new Date(e.dateSubmitted).toLocaleDateString()}</td>
                <td className="actions">
                  <button className="approve" onClick={() => updateStatus(e._id, 'approved')}>Approve</button>
                  <button className="reject" onClick={() => updateStatus(e._id, 'rejected')}>Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
