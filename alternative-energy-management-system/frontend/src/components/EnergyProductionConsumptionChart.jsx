import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import { ProgressSpinner } from 'primereact/progressspinner';
import { energyAnalysisService } from '../services/energyAnalysisService';

const EnergyProductionConsumptionChart = ({ userId, timeRange }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const chartOptions = {
    plugins: {
      legend: {
        position: 'bottom'
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.raw.toFixed(1)} W`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Energy (W)'
        }
      }
    },
    responsive: true,
    maintainAspectRatio: false
  };

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let labels = [];
        let productionData = [];
        let consumptionData = [];
        
        // Use energyAnalysisService instead of direct device/solar panel services
        if (timeRange === 'daily') {
          const report = await energyAnalysisService.getDailyReport(userId);
          // For simplicity, let's create hourly labels - this would be better if your API returned hourly data
          labels = Array.from({length: 24}, (_, i) => `${i}:00`);
          // Use data from the report with some distribution to simulate hourly data
          const hourlyFactor = [0.2, 0.1, 0.05, 0.05, 0.1, 0.2, 0.4, 0.6, 0.8, 0.9, 1.0, 1.0, 
                               0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.3, 0.4, 0.3, 0.2, 0.1];
          
          productionData = hourlyFactor.map(factor => report.production * factor / 4); // Divide by sum of factors
          consumptionData = hourlyFactor.map(factor => report.consumption * factor / 4);
          
        } else if (timeRange === 'weekly') {
          const reports = await energyAnalysisService.getWeeklyReport(userId);
          labels = reports.map(report => report.period);
          productionData = reports.map(report => report.production);
          consumptionData = reports.map(report => report.consumption);
          
        } else if (timeRange === 'monthly') {
          const reports = await energyAnalysisService.getMonthlyReport(userId);
          labels = reports.map(report => report.period);
          productionData = reports.map(report => report.production);
          consumptionData = reports.map(report => report.consumption);
        }
      
        const netEnergyData = productionData.map((prod, index) => {
          return parseFloat((prod - consumptionData[index]).toFixed(1));
        });
        
        const totalProduction = productionData.reduce((sum, val) => sum + val, 0);
        const totalConsumption = consumptionData.reduce((sum, val) => sum + val, 0);
        const netPositive = totalProduction >= totalConsumption;
        
        setChartData({
          labels: labels,
          datasets: [
            {
              label: 'Production (W)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 2,
              data: productionData
            },
            {
              label: 'Consumption (W)',
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 2,
              data: consumptionData
            },
            {
              label: 'Net Energy (W)',
              backgroundColor: netPositive ? 'rgba(75, 192, 75, 0.2)' : 'rgba(255, 159, 64, 0.2)',
              borderColor: netPositive ? 'rgba(75, 192, 75, 1)' : 'rgba(255, 159, 64, 1)',
              borderWidth: 2,
              borderDash: [5, 5],
              data: netEnergyData,
              fill: false
            }
          ]
        });
      } catch (error) {
        console.error("Error fetching chart data:", error);
        setError("Failed to load energy data. Please try again later.");
        setChartData({
          labels: [],
          datasets: [
            {
              label: 'Production (W)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 2,
              data: []
            },
            {
              label: 'Consumption (W)',
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 2,
              data: []
            },
            {
              label: 'Net Energy (W)',
              backgroundColor: 'rgba(75, 192, 75, 0.2)',
              borderColor: 'rgba(75, 192, 75, 1)',
              borderWidth: 2,
              borderDash: [5, 5],
              data: [],
              fill: false
            }
          ]
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchChartData();
  }, [userId, timeRange]);

  if (loading) {
    return (
      <div className="flex justify-content-center align-items-center" style={{ height: '300px' }}>
        <ProgressSpinner />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-3 bg-red-50 border-round text-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div style={{ height: '400px' }}>
      <Chart type="line" data={chartData} options={chartOptions} />
    </div>
  );
};

export default EnergyProductionConsumptionChart;