import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { AppProvider } from './context/AppContext';
import { stripePromise, HAS_STRIPE } from './stripe';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import CampaignDetail from './pages/CampaignDetail';
import CampaignFormPage from './pages/CampaignFormPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import OrgRoute from './components/OrgRoute';
import AdminPage from './pages/AdminPage';

function App() {
  const content = (
        <Layout>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/campaigns/new"
              element={
                <OrgRoute>
                  <CampaignFormPage mode="create" />
                </OrgRoute>
              }
            />
            <Route
              path="/campaigns/:id/edit"
              element={
                <OrgRoute>
                  <CampaignFormPage mode="edit" />
                </OrgRoute>
              }
            />
            <Route path="/campaigns/:id" element={<CampaignDetail />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminPage />
                </AdminRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
  );

  return (
    <AppProvider>
      <BrowserRouter>
        {HAS_STRIPE && stripePromise ? (
          <Elements stripe={stripePromise} options={{ locale: 'fr' }}>
            {content}
          </Elements>
        ) : (
          content
        )}
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
