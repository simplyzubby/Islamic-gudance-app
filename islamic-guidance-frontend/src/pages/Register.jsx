import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '', password2: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.username) errs.username = 'Username is required';
    if (!form.email.includes('@')) errs.email = 'Valid email required';
    if (form.password.length < 8) errs.password = 'Minimum 8 characters';
    if (form.password !== form.password2) errs.password2 = 'Passwords do not match';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await authAPI.register(form);
      await authAPI.login({ username: form.username, password: form.password });
      navigate('/dashboard');
    } catch (err) {
      setErrors({ general: err.message || 'Registration failed. Try again.' });
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
          background: radial-gradient(ellipse at 70% 20%, #0f1e35 0%, #0D1117 65%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          font-family: system-ui, sans-serif;
          color: #E8DFD0;
        }
        .auth-card {
          width: 100%;
          max-width: 420px;
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
          background: linear-gradient(90deg, transparent, #4ECDC4, transparent);
        }
        .auth-icon { text-align: center; font-size: 32px; margin-bottom: 16px; }
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
          margin-bottom: 28px;
          font-family: 'Lora', serif;
          font-style: italic;
        }
        .form-group { margin-bottom: 16px; }
        .form-label {
          display: block;
          font-size: 12px;
          color: #8a9ab5;
          margin-bottom: 7px;
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
        .form-input:focus { border-color: rgba(78,205,196,0.5); }
        .form-input.err { border-color: rgba(232,140,140,0.5); }
        .form-input::placeholder { color: #4a5a6a; }
        .field-error { color: #E88C8C; font-size: 12px; margin-top: 5px; }
        .form-error {
          background: rgba(232,140,140,0.1);
          border: 1px solid rgba(232,140,140,0.3);
          border-radius: 10px;
          padding: 10px 14px;
          color: #E88C8C;
          font-size: 13px;
          margin-bottom: 18px;
        }
        .form-submit {
          width: 100%;
          background: linear-gradient(135deg, #2a8a84, #4ECDC4);
          border: none;
          border-radius: 12px;
          padding: 14px;
          color: #0D1117;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.2s;
          font-family: system-ui;
          margin-top: 4px;
        }
        .form-submit:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
        .form-submit:disabled { opacity: 0.5; cursor: not-allowed; }
        .auth-footer {
          text-align: center;
          margin-top: 24px;
          font-size: 13px;
          color: #8a9ab5;
        }
        .auth-footer a { color: #C9A84C; text-decoration: none; }
        .auth-footer a:hover { text-decoration: underline; }
      `}</style>

      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-icon">🤍</div>
          <h1 className="auth-title">Begin Your Journey</h1>
          <p className="auth-subtitle">Create your sanctuary of peace</p>

          {errors.general && <div className="form-error">{errors.general}</div>}

          <form onSubmit={handleSubmit}>
            {[
              { name: 'username', label: 'Username', type: 'text', placeholder: 'your_name' },
              { name: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
              { name: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
              { name: 'password2', label: 'Confirm Password', type: 'password', placeholder: '••••••••' },
            ].map(({ name, label, type, placeholder }) => (
              <div className="form-group" key={name}>
                <label className="form-label" htmlFor={name}>{label}</label>
                <input
                  id={name}
                  name={name}
                  type={type}
                  value={form[name]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  className={`form-input ${errors[name] ? 'err' : ''}`}
                />
                {errors[name] && <div className="field-error">{errors[name]}</div>}
              </div>
            ))}
            <button className="form-submit" type="submit" disabled={loading}>
              {loading ? 'Creating account...' : '✦ Create Account'}
            </button>
          </form>

          <div className="auth-footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </div>
        </div>
      </div>
    </>
  );
}