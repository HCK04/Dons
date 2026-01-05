import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

export default function AdminPage() {
  const {
    users,
    campaigns,
    donations,
    donors,
    organizations,
    addUser,
    deleteUser,
    addOrganization,
    deleteOrganization,
    addDonation,
  } = useAppContext();

  const [userForm, setUserForm] = useState({ name: '', email: '', password: '', role: 'editor' });
  const [orgForm, setOrgForm] = useState({ name: '', description: '' });
  const [donForm, setDonForm] = useState({ campaignId: '', name: '', email: '', amount: '', message: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const resetAlerts = () => {
    setError('');
    setSuccess('');
  };

  const onUserSubmit = async (e) => {
    e.preventDefault();
    resetAlerts();
    try {
      if (!userForm.name || !userForm.email || !userForm.password) throw new Error('Champs utilisateur requis.');
      await addUser(userForm);
      setUserForm({ name: '', email: '', password: '', role: 'editor' });
      setSuccess('Utilisateur ajoute.');
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'ajout d\'utilisateur');
    }
  };

  const onOrgSubmit = async (e) => {
    e.preventDefault();
    resetAlerts();
    try {
      if (!orgForm.name) throw new Error('Nom de l\'organisation requis.');
      await addOrganization(orgForm);
      setOrgForm({ name: '', description: '' });
      setSuccess('Organisation ajoutee.');
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'ajout\n de l\'organisation');
    }
  };

  const onDonationSubmit = async (e) => {
    e.preventDefault();
    resetAlerts();
    try {
      const payload = { ...donForm, amount: Number(donForm.amount), campaignId: Number(donForm.campaignId) };
      if (!payload.campaignId || !payload.name || !payload.email || !payload.amount) throw new Error('Champs du don requis.');
      await addDonation(payload);
      setDonForm({ campaignId: '', name: '', email: '', amount: '', message: '' });
      setSuccess('Don enregistre (admin).');
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'enregistrement du don');
    }
  };

  return (
    <div className="section space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">Administration</p>
          <h1 className="text-2xl font-bold text-dark">Panneau d'administration</h1>
        </div>
        <div className="badge">Utilisateurs: {users.length} · Organisations: {organizations.length} · Campagnes: {campaigns.length}</div>
      </div>

      {error && <div className="rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">{error}</div>}
      {success && <div className="rounded-md bg-green-50 border border-green-200 px-3 py-2 text-sm text-green-700">{success}</div>}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card card-padding space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-dark">Utilisateurs</h2>
            <span className="badge">{users.length}</span>
          </div>
          <form className="space-y-3" onSubmit={onUserSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input className="input" placeholder="Nom" value={userForm.name} onChange={(e) => setUserForm((p) => ({ ...p, name: e.target.value }))} />
              <input className="input" placeholder="Email" type="email" value={userForm.email} onChange={(e) => setUserForm((p) => ({ ...p, email: e.target.value }))} />
              <input className="input" placeholder="Mot de passe" type="password" value={userForm.password} onChange={(e) => setUserForm((p) => ({ ...p, password: e.target.value }))} />
              <select className="input" value={userForm.role} onChange={(e) => setUserForm((p) => ({ ...p, role: e.target.value }))}>
                <option value="editor">utilisateur</option>
                <option value="organisation">organisation</option>
                <option value="admin">admin</option>
              </select>
            </div>
            <button className="btn-primary w-full" type="submit">Ajouter</button>
          </form>
          <div className="divide-y divide-slate-200">
            {users.map((u) => (
              <div key={u.id} className="py-2 flex items-center justify-between text-sm">
                <div className="space-y-0.5">
                  <p className="font-semibold text-dark">{u.name} <span className="badge ml-2">{u.role}</span></p>
                  <p className="text-slate-600">{u.email}</p>
                </div>
                <button className="btn-ghost" onClick={() => deleteUser(u.id)}>Supprimer</button>
              </div>
            ))}
          </div>
        </div>

        <div className="card card-padding space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-dark">Organisations</h2>
            <span className="badge">{organizations.length}</span>
          </div>
          <form className="space-y-3" onSubmit={onOrgSubmit}>
            <input className="input" placeholder="Nom" value={orgForm.name} onChange={(e) => setOrgForm((p) => ({ ...p, name: e.target.value }))} />
            <input className="input" placeholder="Description" value={orgForm.description} onChange={(e) => setOrgForm((p) => ({ ...p, description: e.target.value }))} />
            <button className="btn-primary w-full" type="submit">Ajouter</button>
          </form>
          <div className="divide-y divide-slate-200">
            {organizations.map((o) => (
              <div key={o.id} className="py-2 flex items-center justify-between text-sm">
                <div>
                  <p className="font-semibold text-dark">{o.name}</p>
                  <p className="text-slate-600">{o.description}</p>
                </div>
                <button className="btn-ghost" onClick={() => deleteOrganization(o.id)}>Supprimer</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card card-padding space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-dark">Ajouter un don (sans paiement)</h2>
          <span className="badge">Donateurs: {donors.length} · Dons: {donations.length}</span>
        </div>
        <form className="grid gap-3 lg:grid-cols-6" onSubmit={onDonationSubmit}>
          <select className="input lg:col-span-2" value={donForm.campaignId} onChange={(e) => setDonForm((p) => ({ ...p, campaignId: e.target.value }))}>
            <option value="">Choisir une campagne</option>
            {campaigns.map((c) => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
          <input className="input" placeholder="Nom" value={donForm.name} onChange={(e) => setDonForm((p) => ({ ...p, name: e.target.value }))} />
          <input className="input" placeholder="Email" type="email" value={donForm.email} onChange={(e) => setDonForm((p) => ({ ...p, email: e.target.value }))} />
          <input className="input" placeholder="Montant" type="number" min="1" value={donForm.amount} onChange={(e) => setDonForm((p) => ({ ...p, amount: e.target.value }))} />
          <input className="input lg:col-span-2" placeholder="Message (optionnel)" value={donForm.message} onChange={(e) => setDonForm((p) => ({ ...p, message: e.target.value }))} />
          <div className="lg:col-span-6">
            <button className="btn-primary w-full" type="submit">Enregistrer le don</button>
          </div>
        </form>
      </div>
    </div>
  );
}
