import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import api from '../api';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [donors, setDonors] = useState([]);
  const [donations, setDonations] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [organizations, setOrganizations] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const [camps, dons, dns, orgs, usrs] = await Promise.all([
          api('/api/campaigns'),
          api('/api/donations'),
          api('/api/donors'),
          api('/api/organisations'),
          api('/api/users'),
        ]);
        setCampaigns(
          (camps || []).map((r) => ({
            id: r.id,
            title: r.titre ?? r.title ?? '',
            description: r.description ?? '',
            image: r.image ?? '',
            goal: Number(r.objectif_financier ?? r.goal ?? 0),
            startDate: r.date_debut ?? r.startDate ?? null,
            endDate: r.date_fin ?? r.endDate ?? null,
            creatorId: r.createur_id ?? r.creatorId ?? null,
            organizationId: r.organisation_id ?? r.organizationId ?? null,
          }))
        );
        setDonations(
          (dons || []).map((r) => ({
            id: r.id,
            campaignId: r.campagne_id ?? r.campaignId,
            donorId: r.donateur_id ?? r.donorId,
            amount: Number(r.montant ?? r.amount ?? 0),
            message: r.message ?? '',
            date: r.date_don ?? r.date ?? '',
          }))
        );
        setDonors(
          (dns || []).map((r) => ({
            id: r.id,
            name: r.nom ?? r.name ?? 'Donateur',
            email: r.email ?? '',
          }))
        );
        setOrganizations(
          (orgs || []).map((r) => ({
            id: r.id,
            name: r.nom ?? r.name ?? '',
            description: r.description ?? '',
          }))
        );
        setUsers(
          (usrs || []).map((r) => ({
            id: r.id,
            name: r.name ?? r.nom ?? '',
            email: r.email ?? '',
            role: r.role ?? 'editor',
          }))
        );
      } catch (e) {
        // keep empty on failure
      }
    })();
  }, []);

  const register = async ({ name, email, password, role = 'user' }) => {
    const res = await api('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role }),
    });
    const user = { id: res.id, name: res.name, email: res.email, role: res.role || (role === 'organisation' ? 'organisation' : 'editor') };
    setUsers((prev) => [...prev, user]);
    setCurrentUser(user);
    return user;
  };

  const addOrganization = async ({ name, description }) => {
    const res = await api('/api/organisations', {
      method: 'POST',
      body: JSON.stringify({ nom: name, description }),
    });
    const org = { id: res.id, name: res.nom ?? res.name ?? name, description: res.description ?? description };
    setOrganizations((prev) => [...prev, org]);
    return org;
  };

  const deleteOrganization = async (id) => {
    await api(`/api/organisations/${id}`, { method: 'DELETE' });
    setOrganizations((prev) => prev.filter((o) => o.id !== id));
  };

  const login = async ({ email, password }) => {
    const res = await api('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    const user = { id: res.id, name: res.name, email: res.email, role: res.role || 'editor' };
    setCurrentUser(user);
    return user;
  };

  const logout = () => setCurrentUser(null);

  const addUser = async ({ name, email, password, role = 'editor' }) => {
    const res = await api('/api/users', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role }),
    });
    const newUser = { id: res.id, name: res.name, email: res.email, role: res.role || role };
    setUsers((prev) => [...prev, newUser]);
    return newUser;
  };

  const deleteUser = async (id) => {
    await api(`/api/users/${id}`, { method: 'DELETE' });
    setUsers((prev) => prev.filter((u) => u.id !== id));
    setCampaigns((prev) => prev.filter((c) => c.creatorId !== id));
    setDonations((prev) => prev.filter((d) => d.donorId !== id));
    if (currentUser?.id === id) setCurrentUser(null);
  };

  const createCampaign = async (data) => {
    if (!currentUser) throw new Error('Non authentifie');
    const payload = {
      title: data.title,
      description: data.description,
      image: data.image,
      goal: data.goal,
      startDate: data.startDate,
      endDate: data.endDate,
      creatorId: currentUser.id,
    };
    const res = await api('/api/campaigns', { method: 'POST', body: JSON.stringify(payload) });
    const newCampaign = {
      id: res.id,
      title: res.titre ?? res.title ?? data.title,
      description: res.description ?? data.description,
      image: res.image ?? data.image,
      goal: Number(res.objectif_financier ?? data.goal ?? 0),
      startDate: res.date_debut ?? data.startDate ?? null,
      endDate: res.date_fin ?? data.endDate ?? null,
      creatorId: res.createur_id ?? currentUser.id,
      organizationId: res.organisation_id ?? null,
    };
    setCampaigns((prev) => [...prev, newCampaign]);
    return newCampaign;
  };

  const updateCampaign = async (id, data) => {
    const payload = {
      title: data.title,
      description: data.description,
      image: data.image,
      goal: data.goal,
      startDate: data.startDate,
      endDate: data.endDate,
    };
    const res = await api(`/api/campaigns/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
    const updated = {
      id: res.id,
      title: res.titre ?? res.title ?? data.title,
      description: res.description ?? data.description,
      image: res.image ?? data.image,
      goal: Number(res.objectif_financier ?? data.goal ?? 0),
      startDate: res.date_debut ?? data.startDate ?? null,
      endDate: res.date_fin ?? data.endDate ?? null,
      creatorId: res.createur_id ?? undefined,
      organizationId: res.organisation_id ?? undefined,
    };
    setCampaigns((prev) => prev.map((c) => (c.id === id ? { ...c, ...updated } : c)));
  };

  const deleteCampaign = async (id) => {
    await api(`/api/campaigns/${id}`, { method: 'DELETE' });
    setCampaigns((prev) => prev.filter((c) => c.id !== id));
    setDonations((prev) => prev.filter((d) => d.campaignId !== id));
  };

  const addDonation = async ({ campaignId, name, email, amount, message }) => {
    if (!currentUser) throw new Error('Non authentifie');
    const res = await api('/api/donations', {
      method: 'POST',
      body: JSON.stringify({
        campagne_id: campaignId,
        nom: currentUser.name,
        email: currentUser.email,
        montant: Number(amount),
        message: message || null,
      }),
    });
    const donorRes = res.donor || null;
    const donationRes = res.donation || null;
    if (donorRes) {
      const donorObj = { id: donorRes.id, name: donorRes.nom ?? donorRes.name ?? name, email: donorRes.email ?? email };
      setDonors((prev) => (prev.some((d) => d.id === donorObj.id) ? prev : [...prev, donorObj]));
    }
    if (donationRes) {
      const d = {
        id: donationRes.id,
        campaignId: donationRes.campagne_id ?? campaignId,
        donorId: donationRes.donateur_id ?? (donorRes?.id ?? null),
        amount: Number(donationRes.montant ?? amount),
        message: donationRes.message ?? message ?? '',
        date: donationRes.date_don ?? new Date().toISOString().slice(0, 10),
      };
      setDonations((prev) => [...prev, d]);
      return d;
    }
    // Fallback local state update if backend didn't return expected payload
    const existing = donors.find((d) => d.email === currentUser.email);
    const donor = existing || { id: donors.length + 1, name: currentUser.name, email: currentUser.email };
    if (!existing) setDonors((prev) => [...prev, donor]);
    const newDonation = {
      id: donations.length + 1,
      campaignId,
      donorId: donor.id,
      amount: Number(amount),
      message,
      date: new Date().toISOString().slice(0, 10),
    };
    setDonations((prev) => [...prev, newDonation]);
    return newDonation;
  };

  const getCampaignStats = (campaignId) => {
    const campaignDonations = donations.filter((d) => d.campaignId === campaignId);
    const collected = campaignDonations.reduce((sum, d) => sum + d.amount, 0);
    return {
      collected,
      donorsCount: campaignDonations.length,
      donations: campaignDonations,
    };
  };

  const totals = useMemo(() => {
    const perCampaign = campaigns.map((campaign) => {
      const campaignDonations = donations.filter((d) => d.campaignId === campaign.id);
      const total = campaignDonations.reduce((sum, d) => sum + d.amount, 0);
      return { campaignId: campaign.id, collected: total, donors: campaignDonations.length };
    });
    const totalCollected = perCampaign.reduce((sum, c) => sum + c.collected, 0);
    const totalDonors = donations.length;
    return { perCampaign, totalCollected, totalDonors };
  }, [campaigns, donations]);

  const value = {
    users,
    campaigns,
    donations,
    donors,
    organizations,
    currentUser,
    register,
    login,
    logout,
    addUser,
    deleteUser,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    addDonation,
    addOrganization,
    deleteOrganization,
    getCampaignStats,
    totals,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used inside AppProvider');
  return ctx;
};


