import React, { createContext, useContext, useMemo, useState } from 'react';

const AppContext = createContext(null);

const seedUsers = [
  { id: 1, name: 'Anas', email: 'anas@example.com', role: 'admin', password: 'admin123' },
  { id: 2, name: 'Akram', email: 'akram@example.com', role: 'editor', password: 'secret' },
];

const seedCampaigns = [
  {
    id: 1,
    title: 'Eau potable pour le village',
    description: 'Construction de puits et distribution de filtres a eau.',
    image:
      'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1200&q=80',
    goal: 12000,
    startDate: '2024-01-10',
    endDate: '2024-12-31',
    creatorId: 1,
  },
  {
    id: 2,
    title: 'Kits scolaires 2025',
    description: 'Fournitures scolaires pour 500 eleves en zone rurale.',
    image:
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80',
    goal: 8000,
    startDate: '2024-08-01',
    endDate: '2025-02-15',
    creatorId: 2,
  },
];

const seedDonors = [
  { id: 1, name: 'Sophie Martin', email: 'sophie@example.com' },
  { id: 2, name: 'Karim B.', email: 'karim@example.com' },
];

const seedDonations = [
  { id: 1, campaignId: 1, donorId: 1, amount: 150, message: 'Bravo pour l initiative !', date: '2024-09-10' },
  { id: 2, campaignId: 1, donorId: 2, amount: 70, message: 'Avec tout mon soutien.', date: '2024-09-12' },
  { id: 3, campaignId: 2, donorId: 1, amount: 90, message: 'Pour les enfants.', date: '2024-09-14' },
];

const seedOrganizations = [
  { id: 1, name: 'Croix Rouge Locale', description: 'Aide humanitaire' },
  { id: 2, name: 'Enfants du Monde', description: 'Soutien aux enfants' },
];

export function AppProvider({ children }) {
  const [users, setUsers] = useState(seedUsers);
  const [campaigns, setCampaigns] = useState(seedCampaigns);
  const [donors, setDonors] = useState(seedDonors);
  const [donations, setDonations] = useState(seedDonations);
  const [currentUser, setCurrentUser] = useState(seedUsers[0]);
  const [organizations, setOrganizations] = useState(seedOrganizations);

  const register = ({ name, email, password }) => {
    const exists = users.some((u) => u.email === email);
    if (exists) throw new Error('Un compte existe deja avec cet email.');
    const newUser = { id: users.length + 1, name, email, password, role: 'editor' };
    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    return newUser;
  };

  const addOrganization = ({ name, description }) => {
    const newOrg = { id: organizations.length + 1, name, description };
    setOrganizations((prev) => [...prev, newOrg]);
    return newOrg;
  };

  const deleteOrganization = (id) => {
    setOrganizations((prev) => prev.filter((o) => o.id !== id));
  };

  const login = ({ email, password }) => {
    const user = users.find((u) => u.email === email && u.password === password);
    if (!user) throw new Error('Identifiants incorrects');
    setCurrentUser(user);
    return user;
  };

  const logout = () => setCurrentUser(null);

  const addUser = ({ name, email, password, role = 'editor' }) => {
    const exists = users.some((u) => u.email === email);
    if (exists) throw new Error('Email deja utilise.');
    const newUser = { id: users.length + 1, name, email, password, role };
    setUsers((prev) => [...prev, newUser]);
    return newUser;
  };

  const deleteUser = (id) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    setCampaigns((prev) => prev.filter((c) => c.creatorId !== id));
    setDonations((prev) => prev.filter((d) => d.donorId !== id));
    if (currentUser?.id === id) setCurrentUser(null);
  };

  const createCampaign = (data) => {
    if (!currentUser) throw new Error('Non authentifie');
    const newCampaign = {
      ...data,
      id: campaigns.length + 1,
      creatorId: currentUser.id,
    };
    setCampaigns((prev) => [...prev, newCampaign]);
    return newCampaign;
  };

  const updateCampaign = (id, data) => {
    setCampaigns((prev) => prev.map((c) => (c.id === id ? { ...c, ...data } : c)));
  };

  const deleteCampaign = (id) => {
    setCampaigns((prev) => prev.filter((c) => c.id !== id));
    setDonations((prev) => prev.filter((d) => d.campaignId !== id));
  };

  const addDonation = ({ campaignId, name, email, amount, message }) => {
    const existing = donors.find((d) => d.email === email);
    const donor = existing || { id: donors.length + 1, name, email };
    if (!existing) {
      setDonors((prev) => [...prev, donor]);
    }
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

  const value = useMemo(
    () => ({
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
    }),
    [users, campaigns, donations, donors, organizations, currentUser, totals]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used inside AppProvider');
  return ctx;
};

