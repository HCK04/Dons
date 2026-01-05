import React, { useEffect, useState } from 'react';

const emptyState = {
  title: '',
  description: '',
  image: '',
  goal: '',
  startDate: '',
  endDate: '',
};

export default function CampaignForm({ onSubmit, initialValues, submitLabel }) {
  const [form, setForm] = useState(emptyState);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialValues) {
      setForm({
        title: initialValues.title || '',
        description: initialValues.description || '',
        image: initialValues.image || '',
        goal: initialValues.goal || '',
        startDate: initialValues.startDate || '',
        endDate: initialValues.endDate || '',
      });
    }
  }, [initialValues]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!form.title || !form.description || !form.goal) {
      setError('Titre, description et objectif sont obligatoires.');
      return;
    }
    const payload = { ...form, goal: Number(form.goal) };
    onSubmit(payload);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="label">Titre</label>
        <input className="input" name="title" value={form.title} onChange={handleChange} placeholder="Titre de la campagne" />
      </div>
      <div>
        <label className="label">Description</label>
        <textarea
          className="input"
          rows="4"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Detaillez l objectif, les beneficiaires..."
        />
      </div>
      <div>
        <label className="label">Image (URL)</label>
        <input className="input" name="image" value={form.image} onChange={handleChange} placeholder="https://..." />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="label">Objectif (DH)</label>
          <input
            className="input"
            type="number"
            min="1"
            name="goal"
            value={form.goal}
            onChange={handleChange}
            placeholder="10000"
          />
        </div>
        <div>
          <label className="label">Date de debut</label>
          <input className="input" type="date" name="startDate" value={form.startDate} onChange={handleChange} />
        </div>
        <div>
          <label className="label">Date de fin</label>
          <input className="input" type="date" name="endDate" value={form.endDate} onChange={handleChange} />
        </div>
      </div>
      {error && <div className="rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">{error}</div>}
      <button type="submit" className="btn-primary w-full">
        {submitLabel || 'Enregistrer'}
      </button>
    </form>
  );
}


