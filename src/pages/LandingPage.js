import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import CampaignCard from '../components/CampaignCard';
import StatGrid from '../components/StatGrid';

export default function LandingPage() {
  const { campaigns, totals, donations, donors } = useAppContext();
  const stats = [
    {
      label: 'Montant collecte',
      value: totals.totalCollected.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' }),
      sub: 'Simule sur les donnees locales',
    },
    { label: 'Donateurs', value: totals.totalDonors },
    { label: 'Campagnes actives', value: campaigns.length },
    {
      label: 'Don moyen',
      value:
        totals.totalDonors > 0
          ? (totals.totalCollected / totals.totalDonors).toLocaleString('fr-FR', {
              style: 'currency',
              currency: 'EUR',
              maximumFractionDigits: 0,
            })
          : '0',
    },
  ];

  return (
    <div className="space-y-12">
      <section className="section grid gap-8 lg:grid-cols-[1.2fr,1fr] items-center hero rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200 tilt-wrapper">
        <div className="space-y-6">
          <span className="badge float">Plateforme de dons</span>
          <h1 className="text-3xl md:text-4xl font-bold text-dark leading-tight">
            Creez, partagez et suivez vos campagnes caritatives en ligne.
          </h1>
          <p className="text-lg text-slate-600">
            Authentification, tableau de bord, suivi des montants collectes, formulaires de dons, statistiques globales
            et pages publiques de campagnes. Frontend uniquement, API simulee.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/campaigns/new" className="btn-primary shadow-lg shadow-blue-200 hover:-translate-y-0.5 transition">
              Lancer une campagne
            </Link>
            <Link to="/dashboard" className="btn-ghost hover:-translate-y-0.5 transition">
              Voir le tableau de bord
            </Link>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-600">
            <div className="flex -space-x-2">
              {donors.slice(0, 3).map((d) => (
                <span
                  key={d.id}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-semibold border border-white shadow-sm"
                >
                  {d.name.slice(0, 1)}
                </span>
              ))}
            </div>
            <div>
              <p className="font-semibold text-dark">{donations.length} dons enregistres</p>
              <p className="text-slate-500 text-sm">Simulation Stripe test / API front</p>
            </div>
          </div>
        </div>
        <div className="card card-padding space-y-4 tilt-card">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Statistiques globales</p>
            <span className="badge">Live</span>
          </div>
          <StatGrid stats={stats} />
        </div>
      </section>

      <section className="section space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-dark">Campagnes publiques</h2>
          <Link to="/campaigns/new" className="text-sm text-primary font-semibold">
            Creer une campagne
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign) => {
            const statsCampaign = totals.perCampaign.find((c) => c.campaignId === campaign.id) || {
              collected: 0,
              donors: 0,
            };
            return (
              <CampaignCard
                key={campaign.id}
                campaign={campaign}
                collected={statsCampaign.collected}
                donors={statsCampaign.donors}
              />
            );
          })}
        </div>
      </section>
    </div>
  );
}

