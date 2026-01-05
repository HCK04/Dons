import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function RegisterPage() {
  const { register } = useAppContext();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', type: 'user' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      setLoading(true);
      const role = form.type === 'organisation' ? 'organisation' : 'user';
      await register({ name: form.name, email: form.email, password: form.password, role });
      navigate('/dashboard');
    } catch (err) {
      const msg = (err && (err.body?.details || err.body?.error || err.message)) || 'Erreur interne';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section max-w-md">
      <div className="card card-padding space-y-6">
        <div className="space-y-1">
          <p className="text-sm text-slate-500">MMB Donations</p>
          <h1 className="text-2xl font-bold text-dark">Inscription</h1>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="radio"
                name="type"
                value="user"
                checked={form.type === 'user'}
                onChange={handleChange}
              />
              <span>Donateur</span>
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="radio"
                name="type"
                value="organisation"
                checked={form.type === 'organisation'}
                onChange={handleChange}
              />
              <span>Organisation</span>
            </label>
          </div>
          <div>
            <label className="label">Nom</label>
            <input className="input" name="name" value={form.name} onChange={handleChange} placeholder="Votre nom" autoComplete="name" />
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input" type="email" name="email" value={form.email} onChange={handleChange} placeholder="email@example.com" autoComplete="email" />
          </div>
          <div>
            <label className="label">Mot de passe</label>
            <input className="input" type="password" name="password" value={form.password} onChange={handleChange} placeholder="••••••••" autoComplete="new-password" />
          </div>
          {error && <div className="rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">{error}</div>}
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? 'Creation…' : 'Creer mon compte'}
          </button>
        </form>
        <p className="text-sm text-slate-600">
          Deja un compte ?{' '}
          <Link to="/login" className="text-primary font-semibold">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}


