import Supplies from "../../models/Supplies.js";

const getTotalSupplies = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const totalSuppliesToday = await Supplies.countDocuments({
      createdAt: { $gte: today },
    });

    const totalSuppliesYesterday = await Supplies.countDocuments({
      createdAt: { $gte: yesterday, $lt: today },
    });
    const totalSupplies = await Supplies.countDocuments();

    return res.json({
      total: totalSupplies,
      totalSuppliesYesterday: totalSuppliesYesterday,
      totalSuppliesToday: totalSuppliesToday,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "An error occurred, contact the admin",
    });
  }
};

export default getTotalSupplies;
