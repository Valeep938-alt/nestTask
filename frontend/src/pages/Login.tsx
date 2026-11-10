import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getErrorMessage } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { homePathFor } from '../utils/routes';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      navigate(homePathFor(user.role));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <form className="auth-card" onSubmit={submit}>
        <p className="eyebrow">Acceso</p>
        <h1 className="title">
          Bienvenido <em>de nuevo</em>.
        </h1>
        {error && <div className="alert">{error}</div>}

        <div className="field">
          <label className="label">Correo</label>
          <input className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="field">
          <label className="label">Contraseña</label>
          <input className="input" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        <button className="btn" style={{ width: '100%' }} disabled={loading}>
          {loading ? 'Entrando…' : 'Acceder'}
        </button>
        <p className="card-meta" style={{ marginTop: '1.2rem' }}>
          ¿No tienes cuenta? <Link to="/registro" style={{ textDecoration: 'underline' }}>Regístrate</Link>
        </p>
      </form>
    </div>
  );
}
