import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import DonationForm from '../components/DonationForm';
import DonationList from '../components/DonationList';

export default function CampaignDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { campaigns, getCampaignStats, addDonation, donors, currentUser } = useAppContext();
  const campaign = campaigns.find((c) => c.id === Number(id));

  if (!campaign) {
    return (
      <div className="section">
        <div className="card card-padding space-y-3">
          <p className="text-lg font-semibold text-dark">Campagne introuvable</p>
          <button className="btn-primary w-max" onClick={() => navigate('/')}>
            Retour a l accueil
          </button>
        </div>
      </div>
    );
  }

  const stats = getCampaignStats(campaign.id);

  const handleDonation = (payload) => {
    addDonation({ ...payload, campaignId: campaign.id });
  };

  const percent = Math.min(100, Math.round((stats.collected / campaign.goal) * 100)) || 0;

  return (
    <div className="section grid gap-8 lg:grid-cols-[1.2fr,0.8fr]">
      <div className="space-y-5">
        <div className="card overflow-hidden">
          <div className="h-72 w-full bg-slate-100">
            <img src={campaign.image} alt={campaign.title} className="h-full w-full object-cover" />
          </div>
          <div className="card-padding space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-slate-500">Campagne publique</p>
                <h1 className="text-2xl font-bold text-dark">{campaign.title}</h1>
              </div>
              <span className="badge">{percent}%</span>
            </div>
            <p className="text-slate-700 leading-relaxed">{campaign.description}</p>
            <div className="space-y-2">
              <div className="w-full bg-slate-100 rounded-full h-3">
                <div className="h-3 rounded-full bg-primary" style={{ width: `${percent}%` }} />
              </div>
              <div className="flex items-center justify-between text-sm text-slate-700">
                <span>
                  {stats.collected.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })} /{' '}
                  {campaign.goal.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                </span>
                <span>{stats.donorsCount} donateurs</span>
              </div>
              <p className="text-xs text-slate-500">
                Dates: {campaign.startDate || 'N/A'} - {campaign.endDate || 'N/A'}
              </p>
              {currentUser && currentUser.id === campaign.creatorId && (
                <button
                  onClick={() => navigate(`/campaigns/${campaign.id}/edit`)}
                  className="btn-ghost text-sm mt-2"
                >
                  Editer la campagne
                </button>
              )}
            </div>
          </div>
        </div>

        <DonationList donations={stats.donations} donors={donors} />
      </div>

      <div className="space-y-4">
        <DonationForm onSubmit={handleDonation} campaignTitle={campaign.title} />
        <div className="card card-padding text-sm text-slate-600">
          <p className="font-semibold text-dark">Simulation Stripe test</p>
          <p>
            Les appels API ne sont pas connectes au backend. Le front simule l ajout de don et met a jour les stats en
            memoire pour la demo.
          </p>
        </div>
      </div>
    </div>
  );
}

