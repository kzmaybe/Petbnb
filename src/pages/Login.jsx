import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import API from '../services/api.js';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await API.post('/auth/login', form);
      login(response.data.user, response.data.token);
      navigate(response.data.user.role === 'sitter' ? '/dashboard/sitter' : '/dashboard/owner');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-md space-y-8">
      <header className="space-y-2 text-center">
        <h1 className="text-3xl font-bold text-slate-900">Welcome back</h1>
        <p className="text-sm text-slate-500">Sign in to manage bookings or connect with pet parents.</p>
      </header>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow">
        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && <p className="rounded-lg bg-rose-50 p-3 text-sm text-rose-600">{error}</p>}
          <div>
            <label className="block text-sm font-medium text-slate-600" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              className="input"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              className="input"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-500">
          New to PetBnB?{' '}
          <Link to="/signup" className="font-semibold text-brand">
            Create an account
          </Link>
        </p>
      </div>
    </section>
  );
}
