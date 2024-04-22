import express from "express";
import Supplies from "../../models/Supplies.js";

const router = express.Router();

router.get("/supplieschart", async (req, res) => {
  try {
    const suppliesChartData = await Supplies.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const labels = suppliesChartData.map((supplies) => supplies._id);
    const data = suppliesChartData.map((supplies) => supplies.count);

    const chartData = {
      labels: labels,
      datasets: [
        {
          label: "Supplies Donated",
          data: data,
          fill: false,
          backgroundColor: "rgba(75,192,192,0.4)",
          borderColor: "rgba(75,192,192,1)",
          borderWidth: 1,
        },
      ],
    };

    res.json(chartData);
  } catch (error) {
    console.error("Error fetching supplies chart data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
