import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import API from '../services/api.js';

export default function Signup() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'owner' });
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
      const response = await API.post('/auth/signup', form);
      login(response.data.user, response.data.token);
      navigate(response.data.user.role === 'sitter' ? '/dashboard/sitter' : '/dashboard/owner');
    } catch (err) {
      setError(err.response?.data?.message || 'We could not create your account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-md space-y-8">
      <header className="space-y-2 text-center">
        <h1 className="text-3xl font-bold text-slate-900">Join PetBnB</h1>
        <p className="text-sm text-slate-500">Create an account to host pets or to book trusted sitters.</p>
      </header>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow">
        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && <p className="rounded-lg bg-rose-50 p-3 text-sm text-rose-600">{error}</p>}
          <div>
            <label className="block text-sm font-medium text-slate-600" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              name="name"
              className="input"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
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
              autoComplete="new-password"
              className="input"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600" htmlFor="role">
              I am signing up as
            </label>
            <select id="role" name="role" value={form.role} onChange={handleChange} className="input">
              <option value="owner">Pet owner</option>
              <option value="sitter">Pet sitter / host</option>
            </select>
          </div>
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? 'Creating account...' : 'Sign up'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-brand">
            Log in
          </Link>
        </p>
      </div>
    </section>
  );
}
