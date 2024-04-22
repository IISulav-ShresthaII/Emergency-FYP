import express from "express";
import User from "../../models/User.js";

const router = express.Router();

router.get("/userchart", async (req, res) => {
  try {
    const userChartData = await User.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const labels = userChartData.map((user) => user._id);
    const data = userChartData.map((user) => user.count);

    const chartData = {
      labels: labels,
      datasets: [
        {
          label: "Users Chart",
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
    console.error("Error fetching user chart data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
