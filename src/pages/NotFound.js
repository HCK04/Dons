import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="section max-w-xl">
      <div className="card card-padding space-y-3">
        <h1 className="text-2xl font-bold text-dark">Page introuvable</h1>
        <p className="text-slate-600">La page demandee n existe pas. Retournez a l accueil ou au tableau de bord.</p>
        <div className="flex gap-3">
          <Link to="/" className="btn-primary">
            Accueil
          </Link>
          <Link to="/dashboard" className="btn-ghost">
            Tableau de bord
          </Link>
        </div>
      </div>
    </div>
  );
}


