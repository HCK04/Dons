import React, { useEffect, useState } from 'react';

export default function DonationForm({ onSubmit, campaignTitle, lockIdentity = false, prefillName = '', prefillEmail = '' }) {
  const [form, setForm] = useState({ name: '', email: '', amount: '', message: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (lockIdentity) {
      setForm((prev) => ({ ...prev, name: prefillName || prev.name, email: prefillEmail || prev.email }));
    }
  }, [lockIdentity, prefillName, prefillEmail]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const amountNumber = Number(form.amount);
    if (!form.name || !form.email || !amountNumber || amountNumber <= 0) {
      setError('Nom, email et montant valide requis.');
      return;
    }
    try {
      await onSubmit({ ...form, amount: amountNumber });
      setSuccess('Don enregistre. Merci !');
      setForm((prev) => ({
        name: lockIdentity ? prev.name : '',
        email: lockIdentity ? prev.email : '',
        amount: '',
        message: '',
      }));
    } catch (err) {
      setError(err?.message || 'Impossible d\u2019enregistrer le don.');
    }
  };

  return (
    <div className="card card-padding space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-dark">Faire un don</h3>
        <p className="text-sm text-slate-600">Campagne: {campaignTitle}</p>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="label">Nom</label>
          <input
            className="input"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Votre nom"
            disabled={lockIdentity}
          />
        </div>
        <div>
          <label className="label">Email</label>
          <input
            className="input"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="email@example.com"
            disabled={lockIdentity}
          />
        </div>
        <div>
          <label className="label">Montant (DH)</label>
          <input
            className="input"
            type="number"
            name="amount"
            min="1"
            value={form.amount}
            onChange={handleChange}
            placeholder="50"
          />
        </div>
        <div>
          <label className="label">Message</label>
          <textarea
            className="input"
            rows="3"
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Message de soutien (optionnel)"
          />
        </div>
        {error && <div className="rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">{error}</div>}
        {success && (
          <div className="rounded-md bg-green-50 border border-green-200 px-3 py-2 text-sm text-green-700">{success}</div>
        )}
        <button type="submit" className="btn-primary w-full">
          Valider le don
        </button>
      </form>
    </div>
  );
}