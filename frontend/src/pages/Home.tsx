import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { homePathFor } from '../utils/routes';

export default function Home() {
  const { user } = useAuth();

  return (
    <section className="hero">
      <div className="container">
        <p className="eyebrow">Espacio académico · 2026</p>
        <h1 className="title">
          Tareas claras para <em>aprender</em> mejor.
        </h1>

        <div className="hero-bottom">
          <p className="lead">
            El profesor crea y asigna tareas; cada estudiante ve las suyas al iniciar sesión y
            actualiza su avance.
          </p>
          <div className="hero-actions">
            {user ? (
              <Link className="btn" to={homePathFor(user.role)}>
                Ir a mi espacio
              </Link>
            ) : (
              <>
                <Link className="btn" to="/login">
                  Acceder
                </Link>
                <Link className="btn outline" to="/registro">
                  Crear cuenta
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
