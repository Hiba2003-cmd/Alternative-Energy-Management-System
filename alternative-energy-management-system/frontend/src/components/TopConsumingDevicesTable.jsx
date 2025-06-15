import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const TopConsumingDevicesTable = ({ devices }) => {
  const [topDevices, setTopDevices] = useState([]);
  
  useEffect(() => {
    if (devices && devices.length > 0) {
      const devicesWithConsumption = devices.map(device => {
        return {
          ...device,
          dailyConsumption: (device.powerConsumption * device.dailyUsageHours / 1000).toFixed(2) // Convert to kWh
        };
      });
      
      const sorted = [...devicesWithConsumption].sort((a, b) => 
        parseFloat(b.dailyConsumption) - parseFloat(a.dailyConsumption)
      ).slice(0, 5);
      
      setTopDevices(sorted);
    }
  }, [devices]);

  return (
    <DataTable value={topDevices} className="mb-4">
      <Column field="modelBrand" header="Device" sortable />
      <Column field="category" header="Category" sortable />
      <Column field="dailyUsageHours" header="Hours Used" sortable />
      <Column 
        field="dailyConsumption" 
        header="Consumption Daily (kWh)" 
        sortable
        body={(rowData) => <strong>{rowData.dailyConsumption}</strong>}
      />
    </DataTable>
  );
};

export default TopConsumingDevicesTable;