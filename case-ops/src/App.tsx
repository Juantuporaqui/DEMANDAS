// ============================================
// CASE OPS - Main App Component
// ============================================

import { type CSSProperties, type FormEvent, useEffect, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/router';
import { seedDatabase } from './db/seed';
import './index.css';

const AUTH_SESSION_KEY = 'caseops.authenticated';
const AUTH_USERNAME = import.meta.env.VITE_APP_USERNAME ?? 'lajodienda';
const AUTH_PASSWORD = import.meta.env.VITE_APP_PASSWORD ?? 'notieneenmienda';
const AUTH_USERS = [
  { username: AUTH_USERNAME, password: AUTH_PASSWORD },
  { username: 'oscar-benita', password: AUTH_PASSWORD },
  { username: 'ruth-martinez', password: AUTH_PASSWORD },
];

function App() {
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    initializeApp();
    setIsAuthenticated(sessionStorage.getItem(AUTH_SESSION_KEY) === 'true');
  }, []);

  async function initializeApp() {
    try {
      // Seed database on first run
      await seedDatabase();
      setInitialized(true);
    } catch (err) {
      console.error('Initialization error:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    }
  }

  function handleAuthenticated() {
    sessionStorage.setItem(AUTH_SESSION_KEY, 'true');
    setIsAuthenticated(true);
  }

  if (error) {
    return (
      <div className="page" style={{ padding: 20, textAlign: 'center' }}>
        <h1 style={{ color: 'var(--color-danger)' }}>Error de inicialización</h1>
        <p>{error}</p>
        <button
          className="btn btn-primary mt-md"
          onClick={() => window.location.reload()}
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (!initialized) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <div className="spinner" style={{ width: 40, height: 40 }} />
        <p style={{ color: 'var(--text-secondary)' }}>Inicializando Case Ops...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginGate onAuthenticated={handleAuthenticated} />;
  }

  return <RouterProvider router={router} />;
}

function LoginGate({ onAuthenticated }: { onAuthenticated: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const hasValidCredentials = AUTH_USERS.some(
      (user) => user.username === username && user.password === password,
    );

    if (hasValidCredentials) {
      setError(null);
      onAuthenticated();
      return;
    }

    setError('Credenciales incorrectas. Contacta al administrador.');
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: 24,
        background: 'var(--bg)',
        color: 'var(--text)',
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: '100%',
          maxWidth: 420,
          border: '1px solid var(--border)',
          borderRadius: 16,
          padding: 24,
          background: 'var(--surface)',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          boxShadow: '0 12px 30px rgba(0,0,0,0.22)',
        }}
      >
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Acceso privado</h1>
        <p style={{ margin: 0, color: 'var(--text-muted)' }}>
          Esta web contiene información confidencial. Introduce usuario y contraseña.
        </p>

        <label style={{ display: 'grid', gap: 6, marginTop: 6 }}>
          <span>Usuario</span>
          <input
            autoComplete="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
            style={inputStyle}
          />
        </label>

        <label style={{ display: 'grid', gap: 6 }}>
          <span>Contraseña</span>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            style={inputStyle}
          />
        </label>

        {error ? (
          <p style={{ margin: 0, color: 'var(--color-danger)' }} role="alert">
            {error}
          </p>
        ) : null}

        <button type="submit" className="btn btn-primary" style={{ marginTop: 4 }}>
          Iniciar sesión
        </button>
      </form>
    </div>
  );
}

const inputStyle: CSSProperties = {
  width: '100%',
  border: '1px solid var(--border)',
  borderRadius: 10,
  padding: '10px 12px',
  background: 'var(--bg)',
  color: 'var(--text)',
};

export default App;
