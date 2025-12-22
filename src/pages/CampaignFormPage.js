import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import CampaignForm from '../components/CampaignForm';

export default function CampaignFormPage({ mode }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { campaigns, createCampaign, updateCampaign } = useAppContext();

  const isEdit = mode === 'edit';
  const campaign = isEdit ? campaigns.find((c) => c.id === Number(id)) : null;

  const handleSubmit = (data) => {
    if (isEdit && campaign) {
      updateCampaign(campaign.id, data);
      navigate(`/campaigns/${campaign.id}`);
    } else {
      const newCamp = createCampaign(data);
      navigate(`/campaigns/${newCamp.id}`);
    }
  };

  return (
    <div className="section max-w-3xl">
      <div className="card card-padding space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">{isEdit ? 'Mise a jour' : 'Creation'}</p>
            <h1 className="text-2xl font-bold text-dark">
              {isEdit ? 'Editer la campagne' : 'Nouvelle campagne'}
            </h1>
          </div>
          <button className="btn-ghost" onClick={() => navigate(-1)}>
            Retour
          </button>
        </div>
        <CampaignForm onSubmit={handleSubmit} initialValues={campaign} submitLabel={isEdit ? 'Mettre a jour' : 'Creer'} />
      </div>
    </div>
  );
}

