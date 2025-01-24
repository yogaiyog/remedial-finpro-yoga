'use client';

import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const DataReport = () => {
  const [stats, setStats] = useState({
    totalPendingInvoices: 0,
    totalPaidInvoices: 0,
    totalOverdueInvoices: 0,
    totalIncome: 0,
    pendingIncome: 0,
  });

  const [chartData, setChartData] = useState({
    labels: ['Pending', 'Paid', 'Overdue'],
    datasets: [
      {
        label: '# of Invoices',
        data: [0, 0, 0],
        backgroundColor: [
          'rgba(255, 205, 86, 0.2)', // Pending - Yellow
          'rgba(54, 162, 235, 0.2)', // Paid - Blue
          'rgba(255, 99, 132, 0.2)', // Overdue - Red
        ],
        borderColor: [
          'rgba(255, 205, 86, 1)', // Pending - Yellow
          'rgba(54, 162, 235, 1)', // Paid - Blue
          'rgba(255, 99, 132, 1)', // Overdue - Red
        ],
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(
          'http://localhost:8000/api/invoice/87bdabfa-dd2e-4b6f-a841-f21d62afbff1/stats'
        );
        const data = await response.json();

        setStats(data);

        setChartData((prev) => ({
          ...prev,
          datasets: [
            {
              ...prev.datasets[0],
              data: [
                data.totalPendingInvoices,
                data.totalPaidInvoices,
                data.totalOverdueInvoices,
              ],
            },
          ],
        }));
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    fetchStats();
  }, []);

  const totalInvoices =
    stats.totalPendingInvoices +
    stats.totalPaidInvoices +
    stats.totalOverdueInvoices;

  return (
    <div className="collapse collapse-open bg-slate-300 shadow-md shadow-emerald-900 h-full">
      <div className="collapse-title text-xl font-bold">DATA REPORT</div>
      <div className="collapse-content flex gap-2">
        <div className="w-1/2">
          <Doughnut data={chartData} />
          <div className="gap-2">
            <h2 className="text-center text-xl">Total Invoices</h2>
            <h1 className="text-center text-2xl font-bold text-blue-500">
              {totalInvoices}
            </h1>
          </div>
        </div>
        <div className="flex flex-col m-auto text-center gap-4">
          <div>
            <h2 className="text-xl">Paid Income</h2>
            <h1 className="text-2xl text-emerald-500 font-semibold">
              IDR {(stats.totalIncome - stats.pendingIncome).toLocaleString('id-ID')}
            </h1>
          </div>
          <div>
            <h2 className="text-xl">Pending Income</h2>
            <h1 className="text-2xl text-yellow-500 font-semibold">
              IDR {stats.pendingIncome.toLocaleString('id-ID')}
            </h1>
          </div>
          <div className='flex gap-2'>
            <h2 className="text-sm">Total Income :</h2>
            <h1 className="text-md text-green-500 font-semibold">
              IDR {stats.totalIncome.toLocaleString('id-ID')}
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataReport;
