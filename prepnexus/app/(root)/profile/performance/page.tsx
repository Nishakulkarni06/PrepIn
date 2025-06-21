'use client';

import React from 'react';
import { BarChart2, Star, CalendarCheck } from 'lucide-react';
import { Pie } from "react-chartjs-2";
import type { TooltipItem } from 'chart.js';
import type { ChartOptions } from 'chart.js';
import { useCategoryPerformance } from "@/app/hooks/useCategoryPerformance";
import { usePerformanceStats } from "@/app/hooks/usePerformanceStats"; // your hook
import { useCurrentUser } from "@/app/hooks/useCurrentUser"; // your hook
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Legend,
  Tooltip,
} from "chart.js";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, ArcElement, Legend, Tooltip);

export default function PerformancePage() {
  
    const user = useCurrentUser();
  const { chartData } = usePerformanceStats(user?.id);

const data = {
  labels: chartData.labels,
  datasets: [
    {
      label: "Total Score",
      data: chartData.scores,
      borderColor: "rgb(153, 102, 255)",
      backgroundColor: "rgba(153, 102, 255, 0.3)",
      tension: 0.3,
    },
  ],
};

const options = {
  responsive: true,
  scales: {
    y: {
      beginAtZero: true,
      max: 100,
      title: {
        display: true,
        text: "Score",
      },
    },
    x: {
      title: {
        display: true,
        text: "Interview (Date)",
      },
    },
  },
  plugins: {
    legend: { position: "top" as const },
    tooltip: {
      callbacks: {
        label: function (context: any) {
          return `Score: ${context.raw}`;
        },
      },
    },
  },
};
 const { categoryData,loading:categoryLoading} = useCategoryPerformance(user?.id);
  const { totalInterviews, avgScore, accuracy, loading:statsLoading } = usePerformanceStats(user?.id);
  const isLoading = categoryLoading || statsLoading;
  if (!user || isLoading) return <div className="flex flex-col items-center justify-center h-64 w-full">
  <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
  <p className="mt-4 text-sm text-gray-500">Fetching performance stats...</p>
</div>
console.log("Category Data:", categoryData); // Debugging line
{/*pie data */}
const pieData = {
  labels: categoryData.labels,
  datasets: [
    {
      label: "Average Category Score",
      data: categoryData.values,
      backgroundColor: [
  "rgba(255, 99, 132, 0.7)",     // Red
  "rgba(255, 159, 64, 0.7)",     // Orange
  "rgba(75, 192, 192, 0.7)",     // Teal
  "rgba(54, 162, 235, 0.7)",     // Blue
  "rgba(153, 102, 255, 0.7)",    // Purple
],

      borderColor: "#fff",
      borderWidth: 2,
    },
  ],
};
const pieOptions: ChartOptions<'pie'> = {
  responsive: true,
  plugins: {
    tooltip: {
      callbacks: {
        label: (context) => {
          const score = context.parsed;
          const dataset = context.chart.data.datasets[0];
          const total = (dataset.data as number[]).reduce((a, b) => a + b, 0);
          const percentage = ((score / total) * 100).toFixed(1);
          return `${context.label}: ${score}/100 (${percentage}%)`;
        },
      },
    },
    legend: {
      position: "bottom", // Now safely typed
      labels: {
        color: "#374151", // Tailwind's gray-700
        boxWidth: 18,
        padding: 15,
        font: {
          size: 14,
          weight: 500,
        },
      },
    },
  },
  animation: {
    animateScale: true,
    animateRotate: true,
  },
};

  return (
    <div className="flex flex-col gap-6 p-4 bg-[#F4F0EB]">
      
      {/* Top stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center">
        <CalendarCheck className="text-green-600 mb-2" />
        <p className="text-sm text-gray-600">Total Interviews</p>
        <p className="text-2xl font-bold text-black">{totalInterviews}</p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center">
        <BarChart2 className="text-pink-600 mb-2" />
        <p className="text-sm text-gray-600">Average Score</p>
        <p className="text-2xl font-bold text-black">{avgScore}/10</p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center">
        <Star className="text-yellow-500 mb-2" />
        <p className="text-sm text-gray-600">Accuracy</p>
        <p className="text-2xl font-bold text-black">{accuracy}%</p>
      </div>
      </div>

      {/* Chart + Streak and Interview Details */}
      <div className="grid grid-cols-2 gap-4">
        {/* Chart */}
        <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center gap-4">
          <h3 className="text-lg font-semibold text-gray-700">Your Performance Graph</h3>
          <Line data={data} options={options} />
        </div>

        {/* pie chart*/}
        <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center gap-4">
          <h3 className="text-lg font-semibold text-gray-700">Average Category-wise Performance</h3>
          <div className="w-85 h-85">
           <Pie data={pieData} options={pieOptions} />
          </div>
     
   
  
        </div>
      </div>
    </div>
  );
}