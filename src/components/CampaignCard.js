import React from 'react';
import { Link } from 'react-router-dom';

export default function CampaignCard({ campaign, collected, donors }) {
  const percent = Math.min(100, Math.round((collected / campaign.goal) * 100)) || 0;
  return (
    <div className="tilt-wrapper">
      <div className="card tilt-card">
      <div className="h-44 w-full overflow-hidden rounded-t-lg relative">
        <img src={campaign.image} alt={campaign.title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent" />
      </div>
      <div className="card-padding space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-lg font-semibold text-dark">{campaign.title}</h3>
            <p className="text-sm text-slate-600">{campaign.description}</p>
          </div>
          <span className="badge">{percent}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2">
          <div className="h-2 rounded-full bg-primary" style={{ width: `${percent}%` }} />
        </div>
        <div className="flex items-center justify-between text-sm text-slate-700">
          <span>
            {collected.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })} /{' '}
            {campaign.goal.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
          </span>
          <span className="text-slate-500">{donors} donateurs</span>
        </div>
        <Link to={`/campaigns/${campaign.id}`} className="btn-primary w-full text-center">
          Voir la campagne
        </Link>
      </div>
      </div>
    </div>
  );
}

