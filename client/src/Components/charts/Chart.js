import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import "chartjs-adapter-date-fns";

// Register necessary Chart.js modules
Chart.register(...registerables);
Chart.register(ChartDataLabels);

const Charts = () => {
  // State to hold chart data
  const [chartData, setChartData] = useState({});

  // Fetch chart data from server on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const itemResponse = await axios.get(
          "http://localhost:4000/Items/chart/Itemchart"
        );
        const suppliesResponse = await axios.get(
          "http://localhost:4000/Supplies/supplieschart"
        );
        const userResponse = await axios.get(
          "http://localhost:4000/Users/userchart"
        );

        const itemData = itemResponse.data;
        const suppliesData = suppliesResponse.data;
        const userData = userResponse.data;
        // Define custom color palette
        const itemColor = "rgb(75, 192, 192)"; // Turquoise
        const suppliesColor = "rgb(255, 99, 132)"; // Coral
        const userColor = "rgb(54, 162, 235)"; // Dodger Blue

        // Combine data from both responses
        const combinedData = {
          labels: itemData.labels || [],
          datasets: [
            ...itemData.datasets.map((dataset) => ({
              ...dataset,
              borderColor: itemColor,
              backgroundColor: itemColor
                .replace("rgb", "rgba")
                .replace(")", ", 0.2)"),
              pointBackgroundColor: itemColor,
              fill: true,
              tension: 0.5,
              pointBorderColor: itemColor,
            })),
            ...suppliesData.datasets.map((dataset) => ({
              ...dataset,
              borderColor: suppliesColor,
              backgroundColor: suppliesColor
                .replace("rgb", "rgba")
                .replace(")", ", 0.2)"),
              fill: true,
              tension: 0.3,
              pointBackgroundColor: suppliesColor,
              pointBorderColor: suppliesColor,
            })),
            ...userData.datasets.map((dataset) => ({
              ...dataset,
              borderColor: userColor,
              backgroundColor: userColor
                .replace("rgb", "rgba")
                .replace(")", ", 0.2)"),
              fill: true,
              tension: 0.1,
              pointBackgroundColor: userColor,
              pointBorderColor: userColor,
            })),
          ],
        };

        // Update state with combined data
        setChartData(combinedData);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ width: "700px", height: "1000px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Combined Chart
      </h2>
      {chartData.labels && chartData.labels.length > 0 ? (
        <Line
          data={chartData}
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
                  parser: "yyyy-MM-dd",
                  tooltipFormat: "ll",
                  unit: "day",
                  unitStepSize: 1,
                  displayFormats: {
                    day: "yyyy-MM-dd",
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
            elements: {
              point: {
                radius: 0, // Set point radius to 0 to hide points
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

export default Charts;
