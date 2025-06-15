import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Message } from 'primereact/message';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { energyAnalysisService } from '../services/energyAnalysisService';
import jsPDF from 'jspdf';

const ReportsPanel = ({ userId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportData, setReportData] = useState(null);
  
  const reportTypes = [
    { label: 'Daily Report', value: 'daily' },
    { label: 'Weekly Report', value: 'weekly' },
    { label: 'Monthly Report', value: 'monthly' }
  ];

  const handleViewReport = async (reportType) => {
    try {
      setLoading(true);
      setError(null);
      setSelectedReport(reportType);
      
      let response;
      switch (reportType) {
        case 'daily':
          response = await energyAnalysisService.getDailyReport(userId);
          break;
        case 'weekly':
          response = await energyAnalysisService.getWeeklyReport(userId);
          break;
        case 'monthly':
          response = await energyAnalysisService.getMonthlyReport(userId);
          break;
        default:
          throw new Error('Invalid report type');
      }
      
      setReportData(response);
    } catch (error) {
      console.error(`Error fetching ${reportType} report:`, error);
      setError(`Unable to load ${reportType} report. Please try again later.`);
      setReportData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = (reportType) => {
    const doc = new jsPDF();
  
    doc.setFontSize(16);
    doc.text(`${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Energy Report`, 10, 10);
  
    if (Array.isArray(reportData)) {

      reportData.forEach((day, index) => {
        const yOffset = 20 + index * 40;
  
        doc.setFontSize(12);
        doc.text(`Period: ${day.period}`, 10, yOffset);
        doc.text(`Energy Production: ${day.production ? day.production.toFixed(2) : 'N/A'} W`, 10, yOffset + 10);
        doc.text(`Energy Consumption: ${day.consumption ? day.consumption.toFixed(2) : 'N/A'} W`, 10, yOffset + 20);
        doc.text(`Net Energy Balance: ${day.netEnergy ? day.netEnergy.toFixed(2) : 'N/A'} W`, 10, yOffset + 30);
      });
    } else {
      doc.setFontSize(12);
      doc.text(`Period: ${reportData.period || 'N/A'}`, 10, 20);
      doc.text(`Energy Production: ${reportData.production.toFixed(2)} W`, 10, 30);
      doc.text(`Energy Consumption: ${reportData.consumption.toFixed(2)} W`, 10, 40);
      doc.text(`Net Energy Balance: ${reportData.netEnergy.toFixed(2)} W`, 10, 50);
    }

    doc.save(`${reportType.charAt(0).toUpperCase() + reportType.slice(1)}_Energy_Report.pdf`);
  };

  const renderReportData = () => {
    if (!reportData) return null;
    
    const renderDownloadButton = (
      <div className="flex justify-content-between align-items-center mb-3">
        <h3 className="m-0">{selectedReport.charAt(0).toUpperCase() + selectedReport.slice(1)} Energy Report</h3>
        <Button 
          label="Download PDF" 
          icon="pi pi-download" 
          onClick={() => handleDownloadReport(selectedReport)}
          className="p-button-sm"
        />
      </div>
    );
    
    if (Array.isArray(reportData)) {
      return (
        <Card className="mt-4">
          {renderDownloadButton}
          <div className="grid">
            {reportData.map((day, index) => {
              const production = day.production ? day.production.toFixed(2) : 'N/A';
              const consumption = day.consumption ? day.consumption.toFixed(2) : 'N/A';
              const netEnergy = day.netEnergy ? day.netEnergy.toFixed(2) : 'N/A';
  
              return (
                <div key={index} className="col-12 md:col-4">
                  <div className="p-3 border-round bg-light-50">
                    <h4>{day.period}</h4>
                    <p><strong>Energy Production:</strong> {production} W</p>
                    <p><strong>Energy Consumption:</strong> {consumption} W</p>
                    <p><strong>Net Energy Balance:</strong> {netEnergy} W</p>
                    <Tag 
                      value={day.netEnergy >= 0 ? 'Surplus' : 'Deficit'} 
                      severity={day.netEnergy >= 0 ? 'success' : 'danger'}
                    />
                    {day.insight && <p><strong>Insight:</strong> {day.insight.message}</p>}
                    {day.recommendation && <p><strong>Recommendation:</strong> {day.recommendation.message}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      );
    } else {
      const production = reportData.production ? reportData.production.toFixed(2) : 'N/A';
      const consumption = reportData.consumption ? reportData.consumption.toFixed(2) : 'N/A';
      const netEnergy = reportData.netEnergy ? reportData.netEnergy.toFixed(2) : 'N/A';
      
      return (
        <Card className="mt-4">
          {renderDownloadButton}
          
          <div className="grid">
            <div className="col-12 md:col-4">
              <div className="p-3 border-round bg-blue-50">
                <h4>Period</h4>
                <p className="text-xl font-bold">{reportData.period || 'N/A'}</p>
              </div>
            </div>
            
            <div className="col-12 md:col-4">
              <div className="p-3 border-round bg-orange-50">
                <h4>Energy Production</h4>
                <p className="text-xl font-bold">{production} W</p>
              </div>
            </div>
            
            <div className="col-12 md:col-4">
              <div className="p-3 border-round bg-teal-50">
                <h4>Energy Consumption</h4>
                <p className="text-xl font-bold">{consumption} W</p>
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <h4>Net Energy Balance</h4>
            <div className="flex align-items-center">
              <span className="text-2xl font-bold mr-2">{netEnergy} W</span>
              <Tag 
                value={reportData.netEnergy >= 0 ? 'Surplus' : 'Deficit'} 
                severity={reportData.netEnergy >= 0 ? 'success' : 'danger'}
              />
            </div>
          </div>
          
          {reportData.insight && (
            <div className="mt-4">
              <h4>Key Insights</h4>
              <p>{reportData.insight.message}</p>
            </div>
          )}
          
          {reportData.recommendation && (
            <div className="mt-4">
              <h4>Recommendations</h4>
              <p>{reportData.recommendation.message}</p>
            </div>
          )}
        </Card>
      );
    }
  };
  

  return (
    <div>
      <div className="mb-4">
        <p>Generate and view reports for different time periods. You can also download reports as PDF files.</p>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {reportTypes.map((report) => (
          <Button 
            key={report.value}
            label={report.label} 
            icon="pi pi-file-pdf" 
            onClick={() => handleViewReport(report.value)}
            className="p-button-outlined p-button-info"
            loading={loading && selectedReport === report.value}
          />
        ))}
      </div>
      
      {loading && (
        <div className="flex justify-content-center my-4">
          <ProgressSpinner style={{ width: '50px', height: '50px' }} />
        </div>
      )}
      
      {error && (
        <Message severity="error" text={error} style={{ width: '100%' }} />
      )}
      
      {renderReportData()}
    </div>
  );
};

export default ReportsPanel;