import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { TabView, TabPanel } from 'primereact/tabview';
import { Dropdown } from 'primereact/dropdown';
import { ProgressSpinner } from 'primereact/progressspinner';

import { deviceService } from '../services/deviceService';
import { solarPanelService } from '../services/solarPanelService';
import { authService } from '../services/authService';

import EnergyProductionConsumptionChart from '../components/EnergyProductionConsumptionChart';
import TopConsumingDevicesTable from '../components/TopConsumingDevicesTable';
import KpiCard from '../components/KpiCard';
import RecommendationsInsightsPanel from '../components/RecommendationsInsightsPanel'
import ReportsPanel from '../components/ReportsPanel';


const Dashboard = () => {
  const [loading, setLoading] = useState(true);
 const currentUser = authService.getCurrentUser();
     const userId = currentUser ? currentUser.uid : null;
  const [timeRange, setTimeRange] = useState('daily');
  const [devices, setDevices] = useState([]);
  const [dailyProduction, setDailyProduction] = useState(0);
  const [dailyConsumption, setDailyConsumption] = useState(0);

  const timeRangeOptions = [
    { label: 'Daily', value: 'daily' },
    { label: 'Weekly', value: 'weekly' },
    { label: 'Monthly', value: 'monthly' }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const devicesList = await deviceService.getAllDevices(userId);
        setDevices(devicesList);
        
        const consumption = await deviceService.calculateDailyEnergyConsumption(userId);
        setDailyConsumption(consumption);
        

        const production = await solarPanelService.calculateDailyEnergyProduction(userId);
        setDailyProduction(production);
        

        const categories = ['HVAC', 'Lighting', 'Kitchen', 'Electronics', 'Other'];
        const categoryData = {};
        
        for (const category of categories) {
          const categoryConsumption = await deviceService.calculateCategoryDailyConsumption(userId, category);
          categoryData[category] = categoryConsumption;
        }
        
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [userId]);
  
  
  const calculateEnergyBalance = () => {
    return {
      production: dailyProduction.toFixed(1),
      consumption: dailyConsumption.toFixed(1),
      balance: (dailyProduction - dailyConsumption).toFixed(1),
      isPositive: dailyProduction >= dailyConsumption
    };
  };
  
  const energyBalance = calculateEnergyBalance();
  
  const kpis = [
    {
      title: 'Energy Balance',
      value: `${energyBalance.balance} W`,
      icon: energyBalance.isPositive ? 'pi pi-arrow-up' : 'pi pi-arrow-down',
      color: energyBalance.isPositive ? '#4CAF50' : '#F44336'
    },
    {
      title: 'Solar Production',
      value: `${energyBalance.production} W`,
      icon: 'pi pi-sun',
      color: '#FF9800'
    },
    {
      title: 'Consumption',
      value: `${energyBalance.consumption} W`,
      icon: 'pi pi-home',
      color: '#2196F3'
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <ProgressSpinner />
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="text-center mb-4">
        <h1 className="text-3xl font-bold mb-2">Solar Energy Dashboard</h1>
        <p className="text-500">Monitor your solar production and energy consumption</p>
      </div>
      
      {/* KPI Cards Row */}
      <div className="grid">
        {kpis.map((kpi, index) => (
          <div key={index} className="col-12 md:col-6 lg:col-3">
            <KpiCard 
              title={kpi.title}
              value={kpi.value}
              icon={kpi.icon}
              color={kpi.color}
            />
          </div>
        ))}
      </div>
      
      {/* Main Content */}
      <div className="grid">
        {/* Energy Production vs Consumption Chart */}
        <div className="col-12 lg:col-12">
          <Card title="Energy Production vs Consumption" className="shadow-2 mb-4">
            <div className="flex justify-content-end mb-3">
              <Dropdown 
                value={timeRange} 
                options={timeRangeOptions} 
                onChange={(e) => setTimeRange(e.value)} 
                placeholder="Select Time Range"
              />
            </div>
            <div style={{ height: '400px' }}>
              <EnergyProductionConsumptionChart 
                userId={userId}
                timeRange={timeRange}
              />
            </div>
          </Card>
        </div>
        
        {/* Tabs for Reports, Analysis, Insights and Recommendations */}
        <div className="col-12">
  <Card className="shadow-2">
    <TabView>
      {/* Top Consuming Devices */}
      <TabPanel header="Device Analysis">
        <h3 className="text-xl font-semibold mb-3">Top Energy Consuming Devices</h3>
        <TopConsumingDevicesTable devices={devices} />
      </TabPanel>
      
      {/* Energy Saving Recommendations & Insights*/}
      <TabPanel header="Recommendations & Insights">
        <h3 className="text-xl font-semibold mb-3">Energy Saving Recommendations</h3>
        <RecommendationsInsightsPanel userId={userId} />
      </TabPanel>

      {/* Reports */}
      <TabPanel header="Reports">
        <h3 className="text-xl font-semibold mb-3">Energy Reports</h3>
        <ReportsPanel userId={userId} />
      </TabPanel>
    </TabView>
  </Card>
</div>
      </div>
    </div>
  );
};

export default Dashboard;