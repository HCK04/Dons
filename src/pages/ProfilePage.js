import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function ProfilePage() {
  const { currentUser, campaigns, donations, donors } = useAppContext();
  const myCampaigns = campaigns.filter((c) => c.creatorId === currentUser?.id);
  const myDonations = donations.filter((d) => d.donorId === currentUser?.id);

  return (
    <div className="section max-w-4xl space-y-6">
      <div className="card card-padding space-y-2">
        <p className="text-sm text-slate-500">Profil</p>
        <h1 className="text-2xl font-bold text-dark">{currentUser?.name}</h1>
        <p className="text-slate-600">{currentUser?.email}</p>
        <p className="text-sm text-slate-500">Role: {currentUser?.role}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="card card-padding space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-dark">Campagnes creees</h2>
            <Link to="/campaigns/new" className="text-sm text-primary font-semibold">
              Nouvelle campagne
            </Link>
          </div>
          {myCampaigns.length === 0 ? (
            <p className="text-sm text-slate-600">Aucune campagne pour le moment.</p>
          ) : (
            <ul className="space-y-2 text-sm text-slate-700">
              {myCampaigns.map((c) => (
                <li key={c.id} className="flex items-center justify-between">
                  <span>{c.title}</span>
                  <Link to={`/campaigns/${c.id}`} className="text-primary">
                    Voir
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card card-padding space-y-3">
          <h2 className="text-lg font-semibold text-dark">Dons effectues (simulation)</h2>
          {myDonations.length === 0 ? (
            <p className="text-sm text-slate-600">Aucun don enregistre.</p>
          ) : (
            <ul className="space-y-2 text-sm text-slate-700">
              {myDonations.map((d) => (
                <li key={d.id} className="flex items-center justify-between">
                  <span>{donors.find((don) => don.id === d.donorId)?.name || 'Vous'}</span>
                  <span className="text-primary font-semibold">
                    {d.amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

