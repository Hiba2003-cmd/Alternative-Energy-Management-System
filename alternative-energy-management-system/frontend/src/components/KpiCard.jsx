import React from 'react';
import { Card } from 'primereact/card';

const KpiCard = ({ title, value, icon, color }) => {
  return (
    <Card className="shadow-2 mb-4">
      <div className="flex align-items-center">
        <i className={icon} style={{ fontSize: '2.5rem', color: color }}></i>
        <div className="ml-3">
          <div className="text-900 font-medium text-xl">{value}</div>
          <div className="text-600">{title}</div>
        </div>
      </div>
    </Card>
  );
};

export default KpiCard;