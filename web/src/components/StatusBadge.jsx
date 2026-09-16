const COLORS = {
  pending: '#b58900',
  approved: '#1a7f37',
  rejected: '#c62828',
};

export default function StatusBadge({ status }) {
  return (
    <span className="status-badge" style={{ backgroundColor: COLORS[status] || '#666' }}>
      {status}
    </span>
  );
}
