import React from 'react';

export default function StatGrid({ stats }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat) => (
        <div key={stat.label} className="card card-padding">
          <p className="text-sm text-slate-500">{stat.label}</p>
          <p className="text-2xl font-semibold text-dark">{stat.value}</p>
          {stat.sub && <p className="text-xs text-slate-500 mt-1">{stat.sub}</p>}
        </div>
      ))}
    </div>
  );
}


