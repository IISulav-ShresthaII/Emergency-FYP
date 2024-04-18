import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import "chartjs-adapter-date-fns";

// Register necessary Chart.js modules
Chart.register(...registerables);
Chart.register(ChartDataLabels);

const SuppliesChart = () => {
  // State to hold chart data
  const [chartData, setChartData] = useState({});

  // Fetch chart data from server on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/Supplies/supplieschart"
        );
        const { labels, datasets } = response.data;

        // Update state with fetched data
        setChartData({
          labels: labels || [],
          datasets: datasets || [],
        });
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures effect runs only once on mount

  return (
    <div style={{ width: "800px", height: "400px" }}>
      {" "}
      {/* Adjust width and height as needed */}
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Supplies Chart
      </h2>
      {/* Render chart if data is available, otherwise show loading message */}
      {chartData.labels &&
      chartData.labels.length > 0 &&
      chartData.datasets &&
      chartData.datasets.length > 0 ? (
        <Line
          data={{
            labels: chartData.labels,
            datasets: chartData.datasets.map((dataset) => ({
              ...dataset,
              borderColor: "rgb(54, 162, 235)",
              backgroundColor: "rgba(54, 162, 235, 0.2)",
              pointBackgroundColor: "rgb(54, 162, 235)",
              pointBorderColor: "rgb(54, 162, 235)",
              fill: true,
              tension: 0.1,
            })),
          }}
          options={{
            plugins: {
              datalabels: {
                display: true,
                color: "black",
                font: {
                  size: 12,
                  weight: "bold",
                },
              },
            },
            scales: {
              x: {
                type: "time",
                time: {
                  parser: "yyyy-MM-dd", // Updated format here
                  tooltipFormat: "ll",
                  unit: "day",
                  unitStepSize: 1,
                  displayFormats: {
                    day: "yyyy-MM-dd", // Updated format here
                  },
                },
                ticks: {
                  font: {
                    size: 12,
                    weight: "bold",
                  },
                },
              },
              y: {
                ticks: {
                  font: {
                    size: 12,
                    weight: "bold",
                  },
                },
              },
            },
          }}
        />
      ) : (
        <p style={{ textAlign: "center", fontStyle: "italic" }}>Loading...</p>
      )}
    </div>
  );
};

export default SuppliesChart;
