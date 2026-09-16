import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiErrorMessage } from '../api/client';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(form.email, form.password);
      navigate('/trader/submit');
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page narrow">
      <h1>Trader Log In</h1>
      <form onSubmit={handleSubmit} className="form">
        <label>
          Email
          <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </label>
        <label>
          Password
          <input required type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={submitting}>{submitting ? 'Logging in...' : 'Log In'}</button>
      </form>
      <p>Need an account? <Link to="/trader/signup">Sign up</Link></p>
    </div>
  );
}
