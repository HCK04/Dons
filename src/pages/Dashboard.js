import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import StatGrid from '../components/StatGrid';
import CampaignCard from '../components/CampaignCard';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
} from 'recharts';

export default function Dashboard() {
  const { currentUser, campaigns, totals, deleteCampaign } = useAppContext();
  const navigate = useNavigate();

  const myCampaigns = campaigns.filter((c) => c.creatorId === currentUser?.id);
  const canCreateCampaign = currentUser && (currentUser.role === 'organisation' || currentUser.role === 'admin');
  const formatDH = (amount) => `${Number(amount).toLocaleString('fr-MA', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} DH`;
  const stats = [
    {
      label: 'Montant global',
      value: formatDH(totals.totalCollected),
    },
    { label: 'Donateurs', value: totals.totalDonors },
    { label: 'Campagnes', value: campaigns.length },
    {
      label: 'Campagnes personnelles',
      value: myCampaigns.length,
      sub: 'Creees par vous',
    },
  ];

  const chartData = useMemo(
    () =>
      campaigns.map((c) => {
        const stats = totals.perCampaign.find((pc) => pc.campaignId === c.id) || { collected: 0, donors: 0 };
        return {
          name: c.title,
          collecte: stats.collected,
          objectif: c.goal,
          donateurs: stats.donors,
        };
      }),
    [campaigns, totals.perCampaign]
  );

  const handleDelete = (id) => {
    if (window.confirm('Supprimer cette campagne ?')) {
      deleteCampaign(id);
    }
  };

  return (
    <div className="section space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">Bienvenue {currentUser?.name}</p>
          <h1 className="text-2xl font-bold text-dark">Tableau de bord</h1>
        </div>
        <div className="flex gap-3">
          {canCreateCampaign && (
            <Link to="/campaigns/new" className="btn-primary">
              Nouvelle campagne
            </Link>
          )}
          <Link to="/profile" className="btn-ghost">
            Profil
          </Link>
        </div>
      </div>

      <StatGrid stats={stats} />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card card-padding space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Collecte vs objectif</p>
            <span className="badge">Vue globale</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorCollecte" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="collecte"
                  stroke="#2563eb"
                  fill="url(#colorCollecte)"
                  strokeWidth={2}
                  name="Collecte"
                />
                <Area type="monotone" dataKey="objectif" stroke="#10b981" strokeWidth={1.5} name="Objectif" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card card-padding space-y-4 tilt-card">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Donateurs par campagne</p>
            <span className="badge">Top</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 12 }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="donateurs" fill="#0ea5e9" radius={[6, 6, 0, 0]} name="Donateurs" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-dark">Vos campagnes</h2>
          <span className="badge">{myCampaigns.length} campagnes</span>
        </div>
        {myCampaigns.length === 0 ? (
          <div className="card card-padding text-sm text-slate-600">
            Vous n avez pas encore de campagne.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {myCampaigns.map((c) => {
              const statsCampaign = totals.perCampaign.find((pc) => pc.campaignId === c.id) || {
                collected: 0,
                donors: 0,
              };
              return (
                <div key={c.id} className="relative">
                  <CampaignCard campaign={c} collected={statsCampaign.collected} donors={statsCampaign.donors} />
                  <div className="absolute right-3 top-3 flex gap-2">
                    <button
                      onClick={() => navigate(`/campaigns/${c.id}/edit`)}
                      className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-primary shadow"
                    >
                      Editer
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-red-600 shadow"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

