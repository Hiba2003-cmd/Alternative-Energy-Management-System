import React, { useState, useEffect } from "react";
import { ProgressSpinner } from "primereact/progressspinner";
import { Message } from "primereact/message";
import { Card } from "primereact/card";
import { energyAnalysisService } from "../services/energyAnalysisService";

const RecommendationsInsightsPanel = ({ userId }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recommendationsMessage, setRecommendationsMessage] = useState(null);
  const [insightMessage, setInsightMessage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const recResponse = await energyAnalysisService.getEnergyRecommendation(
          userId
        );
        setRecommendationsMessage(recResponse.message)
        const insResponse = await energyAnalysisService.getEnergyInsight(
          userId
        );
        setInsightMessage(insResponse.message);

      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Unable to load recommendations. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  if (loading) {
    return (
      <div
        className="flex justify-content-center align-items-center"
        style={{ height: "200px" }}
      >
        <ProgressSpinner />
      </div>
    );
  }

  if (error) {
    return <Message severity="error" text={error} />;
  }

  return (
    <div>
      {/* Display the insight message */}
      {insightMessage && (
        <Card className="mb-4">
          <h4>Energy Insight</h4>
          <p>{insightMessage}</p>
        </Card>
      )}

      <p className="mb-3">
        Based on your energy usage patterns, here are personalized
        recommendations to optimize your energy consumption:
      </p>

      {/* Display recommendations */}
      {recommendationsMessage ? (
        <Card className="mb-4">
          <h4> Personalized Recommendations</h4>
          <p>{recommendationsMessage}</p>
        </Card>
      ) : (
        <div className="p-3 bg-gray-100 border-round mb-3">
          <p className="mb-0">Here are some general recommendations:</p>
          <ul className="mt-2">
            <li>Schedule high-energy appliances during off-peak hours.</li>
            <li>Replace older devices with energy-efficient models.</li>
            <li>
              Consider installing smart thermostats and lighting controls.
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default RecommendationsInsightsPanel;
