import express from "express";
import Item from "../../models/Item.js";

const router = express.Router();

router.get("/itemchart", async (req, res) => {
  try {
    const itemsChartData = await Item.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const labels = itemsChartData.map((item) => item._id);
    const data = itemsChartData.map((item) => item.count);

    const chartData = {
      labels: labels,
      datasets: [
        {
          label: "Reports Chart",
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
    console.error("Error fetching items chart data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
