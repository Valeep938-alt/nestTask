import { Link, NavLink, useNavigate } from 'react-router-dom';
import { BRAND } from '../config/brand';
import { useAuth } from '../context/AuthContext';
import { homePathFor } from '../utils/routes';
import ThemeSwitcher from './ThemeSwitcher';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand">
          <span className="brand-dot" />
          {BRAND.name} · {BRAND.suffix}
        </Link>

        <nav className="nav-center">
          {user && (
            <NavLink
              to={homePathFor(user.role)}
              className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
            >
              {user.role === 'profesor' ? 'Panel' : 'Mis tareas'}
            </NavLink>
          )}
        </nav>

        <div className="nav-right">
          <ThemeSwitcher />
          {user ? (
            <>
              <span className="nav-user">{user.name}</span>
              <button className="btn" onClick={handleLogout}>
                Salir
              </button>
            </>
          ) : (
            <>
              <Link className="nav-link" to="/login">
                Acceder
              </Link>
              <Link className="btn" to="/registro">
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
