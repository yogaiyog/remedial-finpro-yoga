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
          '#E1F10E', // Pending - Yellow
          '#0EF18F', // Paid - Blue
          '#F10E70', // Overdue - Red
        ],
        borderColor: [
          '#788108', // Pending - Yellow
          '#08814D', // Paid - Blue
          '#81083C', // Overdue - Red
        ],
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    const fetchStats = async () => {
      const userId = localStorage.getItem("userId")
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_API_URL}invoice/${userId}/stats`
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
      <div className="collapse-title text-xl font-bold text-center">DATA REPORT</div>
      { totalInvoices ?
        <div className="collapse-content flex gap-2">
          <div className="w-1/2">
            <Doughnut data={chartData} />
            <div className="flex gap-2 justify-center mt-2">
              <h2 className="text-center text-xs">Total Invoices</h2>
              <h1 className="text-center text-xs font-bold text-blue-900">
                {totalInvoices}
              </h1>
            </div>
          </div>
          <div className="flex flex-col m-auto text-center gap-4">
            <div>
              <h2 className="text-xl">Paid Income</h2>
              <h1 className="text-2xl text-emerald-900 font-semibold">
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
              <h1 className="text-md text-slate-800 font-semibold">
                IDR {stats.totalIncome.toLocaleString('id-ID')}
              </h1>
            </div>
          </div>
        </div>: <div className='flex flex-col text-center justify-center text-gray-600'>No data to display</div>
      }
    </div>
  );
};

export default DataReport;
