import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import { Card } from 'primereact/card';
import { ProgressSpinner } from 'primereact/progressspinner';
import { solarPanelService } from '../services/solarPanelService'

const SolarProductionCharts = ({ panels, userId }) => {
    const [dailyProduction, setDailyProduction] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDailyProduction = async () => {
            try {
                setLoading(true);
                const production = await solarPanelService.calculateDailyEnergyProduction(userId);
                setDailyProduction(production);
            } catch (error) {
                console.error("Error fetching daily production:", error);
            } finally {
                setLoading(false);
            }
        };

        if (userId && panels.length > 0) {
            fetchDailyProduction();
        } else {
            setLoading(false);
        }
    }, [userId, panels]);

    const calculateBasePowerProduction = (panel) => {
        return solarPanelService.helpers.calculateBasePowerProduction(panel);
    };

    const calculateDailyPowerProduction = (panel) => {
        return solarPanelService.helpers.calculateDailyPowerProduction(panel);
    };

    const prepareChartData = (groupByKey, calculationFn) => {
        const dataMap = {};
        panels.forEach(panel => {
            const key = panel[groupByKey];
            if (!dataMap[key]) {
                dataMap[key] = 0;
            }
            dataMap[key] += calculationFn(panel);
        });

        return {
            labels: Object.keys(dataMap),
            datasets: [
                {
                    data: Object.values(dataMap),
                    backgroundColor: [
                        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
                    ]
                }
            ]
        };
    };

    const pieOptions = {
        plugins: {
            legend: {
                position: 'bottom'
            }
        }
    };

    if (loading) {
        return (
            <div className="flex justify-content-center p-5">
                <ProgressSpinner />
            </div>
        );
    }

    return (
        <div className="grid">
            <div className="col-12">
                <h3>Solar Panel Analytics</h3>
                <div className="text-xl font-bold mb-3">
                    Daily Energy Production: {dailyProduction !== null ? dailyProduction.toFixed(2) : "N/A"} kWh
                </div>
            </div>
            
            <div className="col-12 md:col-6">
                <Card title="Production by Panel Type">
                    <Chart type="pie" data={prepareChartData('type', calculateBasePowerProduction)} options={pieOptions} />
                </Card>
            </div>
            
            <div className="col-12 md:col-6">
                <Card title="Production by Orientation">
                    <Chart type="pie" data={prepareChartData('orientation', calculateDailyPowerProduction)} options={pieOptions} />
                </Card>
            </div>
        </div>
    );
};

export default SolarProductionCharts;