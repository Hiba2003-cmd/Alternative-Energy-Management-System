import React, { useState, useEffect } from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Message } from 'primereact/message';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import { energyAnalysisService } from '../services/energyAnalysisService';

const InsightsPanel = ({ userId }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setLoading(true);
        const response = await energyAnalysisService.getEnergyInsight(userId);
        
        const formattedInsights = formatInsights(response);
        setInsights(formattedInsights);
      } catch (error) {
        console.error('Error fetching insights:', error);
        setError('Unable to load insights. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, [userId]);

  const formatInsights = (apiResponse) => {
    if (apiResponse && apiResponse.insight && apiResponse.insight.message) {
      const insightMessages = apiResponse.insight.message.split('.').filter(msg => msg.trim());
      return insightMessages.map(msg => msg.trim() + '.');
    }

    else if (Array.isArray(apiResponse)) {
      return apiResponse;
    }
    return [];
  };


  const categorizeInsight = (insight) => {
    const text = insight.toLowerCase();
    if (text.includes('consumption') || text.includes('usage')) {
      return 'consumption';
    } else if (text.includes('production') || text.includes('generation')) {
      return 'production';
    } else if (text.includes('save') || text.includes('saving') || text.includes('efficiency')) {
      return 'efficiency';
    } else {
      return 'general';
    }
  };

  const getInsightIcon = (category) => {
    switch (category) {
      case 'consumption':
        return 'pi pi-bolt';
      case 'production':
        return 'pi pi-sun';
      case 'efficiency':
        return 'pi pi-chart-line';
      default:
        return 'pi pi-info-circle';
    }
  };

  const getInsightColor = (category) => {
    switch (category) {
      case 'consumption':
        return '#2196F3'; // Blue
      case 'production':
        return '#FF9800'; // Orange
      case 'efficiency':
        return '#4CAF50'; // Green
      default:
        return '#9C27B0'; // Purple
    }
  };

  if (loading) {
    return (
      <div className="flex justify-content-center align-items-center" style={{ height: '200px' }}>
        <ProgressSpinner />
      </div>
    );
  }

  if (error) {
    return <Message severity="error" text={error} />;
  }

  if (insights.length === 0) {
    return <Message severity="info" text="No energy insights available at this time." />;
  }

  return (
    <div>
      <p className="mb-3">Here are key insights about your energy usage patterns:</p>
      <div className="grid">
        {insights.map((insight, index) => {
          const category = categorizeInsight(insight);
          const icon = getInsightIcon(category);
          const color = getInsightColor(category);
          
          return (
            <div key={index} className="col-12 md:col-6 lg:col-4 mb-3">
              <Card className="h-full shadow-1">
                <div className="flex align-items-center mb-3">
                  <i 
                    className={`${icon} mr-2`} 
                    style={{ fontSize: '1.5rem', color }}
                  ></i>
                  <h4 className="m-0" style={{ color }}>
                    {category.charAt(0).toUpperCase() + category.slice(1)} Insight
                  </h4>
                </div>
                <Divider />
                <p>{insight}</p>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InsightsPanel;