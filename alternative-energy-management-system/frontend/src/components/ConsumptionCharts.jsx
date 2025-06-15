import React from 'react';
import { Chart } from 'primereact/chart';
import { Card } from 'primereact/card';

const ConsumptionCharts = ({ devices }) => {
    const prepareConsumptionChartData = () => {
        const deviceLabels = devices.map(device => 
            device.modelBrand ? device.modelBrand : 'Unknown Device'
        );
        const consumptionData = devices.map(device => 
            (device.powerConsumption * device.dailyUsageHours).toFixed(2)
        );
        
        return {
            labels: deviceLabels,
            datasets: [
                {
                    label: 'Daily Energy Consumption (Wh)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                    data: consumptionData
                }
            ]
        };
    };
    
    const prepareCategoryChartData = () => {
        const categoryTotals = {};
        devices.forEach(device => {
            const category = device.category;
            const dailyConsumption = device.powerConsumption * device.dailyUsageHours;
            categoryTotals[category] = (categoryTotals[category] || 0) + dailyConsumption;
        });
        
        return {
            labels: Object.keys(categoryTotals),
            datasets: [
                {
                    data: Object.values(categoryTotals).map(value => value.toFixed(2)),
                    backgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56',
                        '#4BC0C0',
                        '#9966FF',
                        '#FF9F40'
                    ]
                }
            ]
        };
    };

    return (
        <div className="grid">
            <div className="col-12 lg:col-6">
                <Card title="Daily Consumption by Device" className="h-full">
                    <Chart type="bar" data={prepareConsumptionChartData()} />
                </Card>
            </div>
            
            <div className="col-12 lg:col-6">
                <Card title="Consumption by Category" className="h-full">
                    <Chart type="pie" data={prepareCategoryChartData()} />
                </Card>
            </div>
        </div>
    );
};

export default ConsumptionCharts;