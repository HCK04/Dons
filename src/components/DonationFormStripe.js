import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

export default function DonationFormStripe({ onSubmit, campaignTitle }) {
  const [form, setForm] = useState({ name: '', email: '', amount: '', message: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

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
      setLoading(true);
      const resp = await fetch('/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amountNumber, currency: 'eur', name: form.name, email: form.email, message: form.message, campaignTitle }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        throw new Error(data.error || 'Echec de creation du paiement');
      }
      const card = elements.getElement(CardElement);
      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card,
          billing_details: { name: form.name, email: form.email },
        },
      });
      if (result.error) {
        throw new Error(result.error.message);
      }
      if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
        onSubmit({ ...form, amount: amountNumber });
        setSuccess('Paiement Stripe (test) reussi. Merci pour votre don !');
        setForm({ name: '', email: '', amount: '', message: '' });
        const cardEl = elements.getElement(CardElement);
        if (cardEl) cardEl.clear();
      } else {
        throw new Error("Le paiement n'a pas pu etre confirme.");
      }
    } catch (err) {
      setError(err.message || 'Erreur de paiement.');
    } finally {
      setLoading(false);
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
          <input className="input" name="name" value={form.name} onChange={handleChange} placeholder="Votre nom" />
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
          />
        </div>
        <div>
          <label className="label">Montant (EUR)</label>
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
          <label className="label">Carte (Stripe test)</label>
          <div className="input py-3">
            <CardElement options={{ hidePostalCode: true }} />
          </div>
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
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? 'Paiement en cours...' : 'Payer avec Stripe (test)'}
        </button>
      </form>
    </div>
  );
}
