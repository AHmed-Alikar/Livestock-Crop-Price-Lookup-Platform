import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiErrorMessage } from '../api/client';

export default function TraderSignup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await signup(form.name, form.email, form.password);
      navigate('/trader/submit');
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page narrow">
      <h1>Trader Sign Up</h1>
      <form onSubmit={handleSubmit} className="form">
        <label>
          Name
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </label>
        <label>
          Email
          <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </label>
        <label>
          Password
          <input required type="password" minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={submitting}>{submitting ? 'Signing up...' : 'Sign Up'}</button>
      </form>
      <p>Already have an account? <Link to="/trader/login">Log in</Link></p>
    </div>
  );
}
