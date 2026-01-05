import React from 'react';

const formatDH = (amount) => `${Number(amount).toLocaleString('fr-MA', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} DH`;

export default function DonationList({ donations, donors }) {
  if (!donations.length) {
    return <div className="card card-padding text-sm text-slate-600">Aucun don pour le moment.</div>;
  }

  const donorName = (donorId) => donors.find((d) => d.id === donorId)?.name || 'Donateur';

  return (
    <div className="card card-padding space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-dark">Messages et dons</h3>
        <span className="badge">{donations.length} contributions</span>
      </div>
      <div className="divide-y divide-slate-200">
        {donations.map((donation) => (
          <div key={donation.id} className="py-3">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-dark">{donorName(donation.donorId)}</p>
              <span className="text-sm text-primary font-semibold">
                {formatDH(donation.amount)}
              </span>
            </div>
            {donation.message && <p className="text-sm text-slate-600">{donation.message}</p>}
            <p className="text-xs text-slate-500 mt-1">{donation.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}


