import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { axiosInstance } from "../../Lib/axios";

// Register Chart.js components for area chart
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend
);

const Analytics = () => {
  const [chartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch data from APIs concurrently
        const [usersResponse, doctorsResponse, earningsResponse, refundsResponse] = await Promise.all([
          axiosInstance.get("/user/total-patients"),
          axiosInstance.get("/doctor/total-doctors"),
          axiosInstance.get("/admin/TotalEarnings"),
          axiosInstance.get("/admin/total-refunds"),
        ]);

        // Extract and convert data
        const totalUsers = Number(usersResponse.data.totalNoOfPatients) || 0;
        const totalDoctors = Number(doctorsResponse.data.totalNoOfDoctors) || 0;
        const totalEarnings = Number(earningsResponse.data.totalEarnings.replace(/,/g, '')) || 0;
        const totalRefunds = Number(refundsResponse.data.totalRefunds) || 0;

        // Log data for debugging
        console.log("Chart Data:", { totalUsers, totalDoctors, totalEarnings: totalEarnings / 1000, totalRefunds });

        // Check for empty data
        if (totalUsers === 0 && totalDoctors === 0 && totalEarnings === 0 && totalRefunds === 0) {
          throw new Error("No data available from APIs");
        }

        // Structure data for area chart
        const data = {
          labels: ["Users", "Doctors", "Earnings (Thousands)", "Refunds"],
          datasets: [
            {
              label: "Metrics",
              data: [totalUsers, totalDoctors, totalEarnings / 1000, totalRefunds],
              backgroundColor: (context) => {
                const chart = context.chart;
                const { ctx, chartArea } = chart;
                if (!chartArea) return null;
                const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
                gradient.addColorStop(0, "rgba(200, 230, 201, 0.3)");
                gradient.addColorStop(1, "rgba(102, 187, 106, 0.5)");
                return gradient;
              },
              borderColor: "#4CAF50",
              borderWidth: 3,
              fill: true,
              tension: 0.4,
              pointBackgroundColor: "#66BB6A",
              pointBorderColor: "#fff",
              pointBorderWidth: 2,
              pointRadius: 5,
              pointHoverRadius: 7,
              pointHoverBackgroundColor: "#4CAF50",
              pointHoverBorderColor: "#fff",
              pointHoverBorderWidth: 2,
              pointStyle: "circle",
            },
          ],
        };

        setChartData({ ...data });
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error.message);
        setError("Failed to load analytics data");
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Loading state with spinner
  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 flex justify-center items-center" aria-label="Loading analytics data">
        <svg
          className="animate-spin h-8 w-8 sm:h-10 sm:w-10 text-teal-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
    );
  }

  // Error state
  if (error) {
    return <div className="p-4 sm:p-6 text-center text-red-600 text-sm sm:text-base">{error}</div>;
  }

  // No data state
  if (!chartData) {
    return <div className="p-4 sm:p-6 text-center text-gray-600 text-sm sm:text-base">No data available</div>;
  }

  // Render area chart
  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-full sm:max-w-3xl md:max-w-4xl mx-auto">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-gray-900 tracking-tight">
        Analytics
      </h2>
      <div
        className="bg-white p-4 sm:p-6 rounded-xl shadow-lg w-full chart-container"
        style={{
          minHeight: "320px",
          borderTop: "4px solid",
          borderImage: "linear-gradient(to right, #26A69A, #4CAF50) 1",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Line
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            animation: {
              duration: 1500,
              easing: "linear",
              x: { from: 0 },
              opacity: { from: 0, to: 1 },
            },
            plugins: {
              legend: {
                position: "top",
                labels: {
                  font: {
                    size: window.innerWidth < 640 ? 12 : 14,
                    weight: "600",
                    family: "'Inter', sans-serif",
                  },
                  color: "#1A3C34",
                  padding: window.innerWidth < 640 ? 10 : 15,
                },
              },
              title: {
                display: true,
                text: "Admin Metrics Overview",
                font: {
                  size: window.innerWidth < 640 ? 16 : 20,
                  weight: "700",
                  family: "'Inter', sans-serif",
                },
                color: "#1A3C34",
                padding: { top: 10, bottom: window.innerWidth < 640 ? 15 : 20 },
              },
              tooltip: {
                enabled: true,
                backgroundColor: "#1A3C34",
                titleFont: {
                  size: window.innerWidth < 640 ? 12 : 14,
                  weight: "bold",
                  family: "'Inter', sans-serif",
                },
                bodyFont: {
                  size: window.innerWidth < 640 ? 10 : 12,
                  family: "'Inter', sans-serif",
                },
                padding: window.innerWidth < 640 ? 8 : 10,
                cornerRadius: 6,
                borderColor: "#4CAF50",
                borderWidth: 1,
                callbacks: {
                  label: (context) => `${context.dataset.label}: ${context.parsed.y.toFixed(2)}`,
                },
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                max: 10,
                title: {
                  display: true,
                  text: "Values (Earnings in Thousands)",
                  font: {
                    size: window.innerWidth < 640 ? 14 : 16,
                    weight: "600",
                    family: "'Inter', sans-serif",
                  },
                  color: "#1A3C34",
                },
                grid: {
                  color: "rgba(144, 238, 144, 0.3)",
                  lineWidth: 1,
                },
                ticks: {
                  color: "#1A3C34",
                  font: {
                    size: window.innerWidth < 640 ? 10 : 12,
                    family: "'Inter', sans-serif",
                  },
                  stepSize: 1,
                  callback: (value) => {
                    if (Number.isInteger(value)) {
                      return value;
                    }
                  },
                  maxTicksLimit: 8,
                },
              },
              x: {
                title: {
                  display: true,
                  text: "Metrics",
                  font: {
                    size: window.innerWidth < 640 ? 14 : 16,
                    weight: "600",
                    family: "'Inter', sans-serif",
                  },
                  color: "#1A3C34",
                },
                grid: { display: false },
                ticks: {
                  color: "#1A3C34",
                  font: {
                    size: window.innerWidth < 640 ? 10 : 12,
                    family: "'Inter', sans-serif",
                  },
                },
              },
            },
            elements: {
              point: {
                pointStyle: "circle",
                borderWidth: window.innerWidth < 640 ? 2 : 3,
                radius: window.innerWidth < 640 ? 4 : 5,
                hoverRadius: window.innerWidth < 640 ? 6 : 7,
                hoverBorderWidth: window.innerWidth < 640 ? 2 : 3,
              },
            },
            layout: {
              padding: window.innerWidth < 640 ? 10 : 20,
            },
          }}
        />
      </div>

      {/* Custom CSS for responsive chart container */}
      <style jsx>{`
        .chart-container {
          position: relative;
          width: 100%;
          height: 320px;
        }
        @media (min-width: 640px) {
          .chart-container {
            height: 400px;
          }
        }
      `}</style>
    </div>
  );
};

export default Analytics;