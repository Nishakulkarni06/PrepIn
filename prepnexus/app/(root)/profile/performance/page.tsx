'use client';

import React from 'react';
import { BarChart2, Star, CalendarCheck } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale, Legend } from 'chart.js';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Legend);

export default function PerformancePage() {
  // Dummy data for chart
  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Dataset 1',
        data: [40, 60, 50, 45, 65, 55, 70],
        borderColor: 'rgb(255, 205, 86)',
        backgroundColor: 'rgba(255, 205, 86, 0.3)',
      },
      {
        label: 'Dataset 2',
        data: [35, 50, 40, 60, 50, 40, 65],
        borderColor: 'rgb(153, 102, 255)',
        backgroundColor: 'rgba(153, 102, 255, 0.3)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
    },
  };

  return (
    <div className="flex flex-col gap-6 p-4 bg-[#F4F0EB]">
      
      {/* Top stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center">
          <CalendarCheck className="text-green-600 mb-2" />
          <p className="text-sm text-gray-600">Total Interviews</p>
          <p className="text-2xl font-bold text-black">10</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center">
          <BarChart2 className="text-pink-600 mb-2" />
          <p className="text-sm text-gray-600">Average score</p>
          <p className="text-2xl font-bold text-black">7/10</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center">
          <Star className="text-yellow-500 mb-2" />
          <p className="text-sm text-gray-600">Accuracy</p>
          <p className="text-2xl font-bold text-black">90%</p>
        </div>
      </div>

      {/* Chart + Streak and Interview Details */}
      <div className="grid grid-cols-2 gap-4">
        {/* Chart */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-center font-medium text-gray-700 mb-4">Your Performance Graph</h3>
          <Line data={data} options={options} />
        </div>

        {/* Streak + Details */}
        <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center gap-4">
          <div className="w-24 h-24 rounded-full border-4 border-green-400 flex items-center justify-center text-xl font-bold text-green-700">
            Streak <br /> 7 🔥
          </div>
          <div className="flex flex-col gap-2 w-full text-sm font-medium">
            <div className="bg-yellow-300 text-black rounded-md px-4 py-2 text-center">
              Frontend Interview - 40/100
            </div>
            <div className="bg-blue-300 text-black rounded-md px-4 py-2 text-center">
              Software Development - 70/100
            </div>
            <div className="bg-pink-300 text-black rounded-md px-4 py-2 text-center">
              Backend Interview - 50/100
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
