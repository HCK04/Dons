import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import logo from '../image.png';

export default function Layout({ children }) {
  const { currentUser, logout } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="section flex items-center justify-between py-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 overflow-hidden">
              <img src={logo} alt="MMB Donations" className="h-full w-full object-cover" />
            </span>
            <span className="text-lg font-bold text-dark tracking-tight">MMB Donations</span>
          </Link>
          <nav className="flex items-center gap-2 sm:gap-3 text-sm font-medium">
            <Link
              to="/"
              className="inline-flex items-center px-3 py-1.5 rounded-full hover:bg-slate-100 hover:text-primary transition"
            >
              Accueil
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center px-3 py-1.5 rounded-full hover:bg-slate-100 hover:text-primary transition"
            >
              Tableau
            </Link>
            {(currentUser?.role === 'organisation' || currentUser?.role === 'admin') && (
              <Link
                to="/campaigns/new"
                className="inline-flex items-center px-3 py-1.5 rounded-full hover:bg-slate-100 hover:text-primary transition"
              >
                Nouvelle campagne
              </Link>
            )}
            {currentUser?.role === 'admin' && (
              <Link
                to="/admin"
                className="inline-flex items-center px-3 py-1.5 rounded-full hover:bg-slate-100 hover:text-primary transition"
              >
                Admin
              </Link>
            )}
            {currentUser ? (
              <>
                <Link
                  to="/profile"
                  className="inline-flex items-center px-3 py-1.5 rounded-full hover:bg-slate-100 hover:text-primary transition"
                >
                  Profil
                </Link>
                <button onClick={handleLogout} className="btn-ghost">
                  Deconnexion
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="inline-flex items-center px-3 py-1.5 rounded-full hover:bg-slate-100 hover:text-primary transition"
                >
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
      <main className="flex-1 py-8 sm:py-10">{children}</main>
      <footer className="mt-auto border-t border-slate-200 bg-white py-6">
        <div className="section flex justify-between text-sm text-slate-500">
          <span>MMB Donations & campagnes solidaires.</span>
          <span>&copy; {new Date().getFullYear()} MMB Donations.</span>
        </div>
      </footer>
    </div>
  );
}


