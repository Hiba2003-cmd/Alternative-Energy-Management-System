import React from 'react';
import { Chart } from 'primereact/chart';

const ConsumptionByCategoryChart = ({ categoryConsumption }) => {
  const chartData = {
    labels: Object.keys(categoryConsumption),
    datasets: [
      {
        data: Object.values(categoryConsumption),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF'
        ]
      }
    ]
  };
  
  const pieOptions = {
    plugins: {
      legend: {
        position: 'right'
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value.toFixed(2)} kWh (${percentage}%)`;
          }
        }
      }
    },
    responsive: true,
    maintainAspectRatio: false
  };

  return <Chart type="pie" data={chartData} options={pieOptions} />;
};

export default ConsumptionByCategoryChart;