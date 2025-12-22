import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function LoginPage() {
  const { login } = useAppContext();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    try {
      login(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="section max-w-md">
      <div className="card card-padding space-y-6">
        <div className="space-y-1">
          <p className="text-sm text-slate-500">Plateforme de Dons</p>
          <h1 className="text-2xl font-bold text-dark">Connexion</h1>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="label">Email</label>
            <input className="input" type="email" name="email" value={form.email} onChange={handleChange} />
          </div>
          <div>
            <label className="label">Mot de passe</label>
            <input className="input" type="password" name="password" value={form.password} onChange={handleChange} />
          </div>
          {error && <div className="rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">{error}</div>}
          <button type="submit" className="btn-primary w-full">
            Se connecter
          </button>
        </form>
        <p className="text-sm text-slate-600">
          Pas de compte ?{' '}
          <Link to="/register" className="text-primary font-semibold">
            Creer un compte
          </Link>
        </p>
        <div className="text-xs text-slate-500">
          Comptes de test: anas@example.com / admin123 ou akram@example.com / secret
        </div>
      </div>
    </div>
  );
}

