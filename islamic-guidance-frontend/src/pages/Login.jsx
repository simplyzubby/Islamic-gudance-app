import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await authAPI.login(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Lora&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; }
        .auth-page {
          min-height: 100vh;
          background: radial-gradient(ellipse at 30% 20%, #0f1e35 0%, #0D1117 65%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          font-family: system-ui, sans-serif;
          color: #E8DFD0;
        }
        .auth-card {
          width: 100%;
          max-width: 400px;
          background: linear-gradient(135deg, #1e2a3a, #1a2840);
          border: 1px solid rgba(201,168,76,0.2);
          border-radius: 24px;
          padding: 40px 36px;
          position: relative;
          overflow: hidden;
        }
        .auth-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, #C9A84C, transparent);
        }
        .auth-icon {
          text-align: center;
          font-size: 32px;
          margin-bottom: 16px;
        }
        .auth-title {
          font-family: 'Playfair Display', serif;
          font-size: 26px;
          text-align: center;
          color: #E8C97A;
          margin-bottom: 6px;
        }
        .auth-subtitle {
          text-align: center;
          color: #8a9ab5;
          font-size: 13px;
          margin-bottom: 32px;
          font-family: 'Lora', serif;
          font-style: italic;
        }
        .form-group { margin-bottom: 18px; }
        .form-label {
          display: block;
          font-size: 12px;
          color: #8a9ab5;
          margin-bottom: 8px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .form-input {
          width: 100%;
          background: rgba(13,17,23,0.6);
          border: 1.5px solid rgba(42,58,80,1);
          border-radius: 12px;
          padding: 12px 16px;
          color: #E8DFD0;
          font-size: 15px;
          font-family: system-ui;
          outline: none;
          transition: border-color 0.2s;
        }
        .form-input:focus { border-color: rgba(201,168,76,0.5); }
        .form-input::placeholder { color: #4a5a6a; }
        .form-error {
          background: rgba(232,140,140,0.1);
          border: 1px solid rgba(232,140,140,0.3);
          border-radius: 10px;
          padding: 10px 14px;
          color: #E88C8C;
          font-size: 13px;
          margin-bottom: 20px;
        }
        .form-submit {
          width: 100%;
          background: linear-gradient(135deg, #8a6e2f, #C9A84C);
          border: none;
          border-radius: 12px;
          padding: 14px;
          color: #0D1117;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.2s;
          font-family: system-ui;
          letter-spacing: 0.04em;
        }
        .form-submit:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
        .form-submit:disabled { opacity: 0.5; cursor: not-allowed; }
        .auth-footer {
          text-align: center;
          margin-top: 24px;
          font-size: 13px;
          color: #8a9ab5;
        }
        .auth-footer a {
          color: #C9A84C;
          text-decoration: none;
        }
        .auth-footer a:hover { text-decoration: underline; }
      `}</style>

      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-icon">🌙</div>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Return to your sanctuary of peace</p>

          {error && <div className="form-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="username">Username</label>
              <input
                id="username"
                className="form-input"
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="your username"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <input
                id="password"
                className="form-input"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>
            <button className="form-submit" type="submit" disabled={loading}>
              {loading ? 'Signing in...' : '✦ Sign In'}
            </button>
          </form>

          <div className="auth-footer">
            Don't have an account?{' '}
            <Link to="/register">Create one</Link>
          </div>
        </div>
      </div>
    </>
  );
}