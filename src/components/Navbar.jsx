import { useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';

const linkClasses = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm font-semibold transition ${
    isActive ? 'bg-white text-brand-dark shadow' : 'text-white/90 hover:bg-white/10'
  }`;

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-gradient-to-r from-brand to-brand-dark text-white shadow-lg">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/" className="text-xl font-black tracking-tight">
          PetBnB
        </Link>
        <div className="flex items-center gap-2">
          <NavLink to="/" className={linkClasses}>
            Home
          </NavLink>
          {user?.role === 'owner' && (
            <NavLink to="/dashboard/owner" className={linkClasses}>
              My Bookings
            </NavLink>
          )}
          {user?.role === 'sitter' && (
            <NavLink to="/dashboard/sitter" className={linkClasses}>
              Host Dashboard
            </NavLink>
          )}
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="rounded-lg bg-white/10 px-3 py-1 text-sm font-medium backdrop-blur">
                {user.name} ({user.role})
              </span>
              <button type="button" className="btn-primary bg-white text-brand" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="btn-primary" to="/login">
                Login
              </Link>
              <Link className="btn-primary bg-white text-brand" to="/signup">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
