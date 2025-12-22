import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function Layout({ children }) {
  const { currentUser, logout } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="section flex items-center justify-between py-4">
          <Link to="/" className="text-lg font-bold text-dark">
            Plateforme de Dons
          </Link>
          <nav className="flex items-center gap-3 text-sm font-medium">
            <Link to="/" className="hover:text-primary">
              Accueil
            </Link>
            <Link to="/dashboard" className="hover:text-primary">
              Tableau de bord
            </Link>
            <Link to="/campaigns/new" className="hover:text-primary">
              Nouvelle campagne
            </Link>
            {currentUser ? (
              <>
                <Link to="/profile" className="hover:text-primary">
                  Profil
                </Link>
                <button onClick={handleLogout} className="btn-ghost">
                  Deconnexion
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-primary">
                  Connexion
                </Link>
                <Link to="/register" className="btn-primary">
                  Inscription
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="py-6">{children}</main>
      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="section flex justify-between text-sm text-slate-500">
          <span>Frontend React + Tailwind - demo sans backend.</span>
          <span>Stripe test simule cote client.</span>
        </div>
      </footer>
    </div>
  );
}

