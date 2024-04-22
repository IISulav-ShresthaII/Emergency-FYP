import Items from "../../models/Item.js";

const getTotalItems = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const totalItemsToday = await Items.countDocuments({
      createdAt: { $gte: today },
    });

    const totalItemsYesterday = await Items.countDocuments({
      createdAt: { $gte: yesterday, $lt: today },
    });

    const totalItems = await Items.countDocuments();

    return res.json({
      totalToday: totalItemsToday,
      totalYesterday: totalItemsYesterday,
      totalOverall: totalItems,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "An error occurred, contact the admin",
    });
  }
};

export default getTotalItems;
