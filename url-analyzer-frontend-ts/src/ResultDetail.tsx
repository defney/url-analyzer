// src/ResultDetail.tsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const ResultDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state?.result;

  if (!data) {
    return (
      <div style={{ padding: '2rem' }}>
        <p>No result data provided. Please go back and select a result.</p>
        <button onClick={() => navigate('/')}>⬅ Back</button>
      </div>
    );
  }

  const brokenLinks = Array.isArray(data.broken_links) ? data.broken_links : [];

  const chartData = {
    labels: ['Internal Links', 'External Links'],
    datasets: [
      {
        data: [data.internal_links, data.external_links],
        backgroundColor: ['#36A2EB', '#FF6384'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>{data.title}</h2>
      <button onClick={() => navigate('/')}>⬅ Back</button>

      <div style={{ maxWidth: '300px', marginTop: '20px' }}>
        <Doughnut data={chartData} />
      </div>

      <h3 style={{ marginTop: '30px' }}>Broken Links</h3>
      {brokenLinks.length === 0 ? (
        <p>No broken links 🎉</p>
      ) : (
        <ul>
          {brokenLinks.map((link: any, idx: number) => (
            <li key={idx}>
              {link.url} → <strong>{link.status}</strong>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ResultDetail;
