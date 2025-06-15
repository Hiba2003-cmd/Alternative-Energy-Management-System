import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Badge } from 'primereact/badge';

const RecommendationsTable = ({ recommendations }) => {
  const impactBadgeTemplate = (recommendation) => {
    const colors = {
      high: 'danger',
      medium: 'warning',
      low: 'info'
    };
    
    return <Badge value={recommendation.impact} severity={colors[recommendation.impact]} />;
  };

  return (
    <DataTable value={recommendations}>
      <Column field="title" header="Recommendation" sortable />
      <Column field="description" header="Description" />
      <Column field="impact" header="Impact" body={impactBadgeTemplate} sortable />
    </DataTable>
  );
};

export default RecommendationsTable;