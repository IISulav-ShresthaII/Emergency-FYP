import mongoose from "mongoose";

const SuppliesSchema = new mongoose.Schema({
  name: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: String, required: true },
  location: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  number: { type: String, required: true },
  collected: { type: Boolean, default: false },
  img: [
    {
      type: String,
      default: "https://i.ibb.co/DpZ3qy2/Untitled-design-10.png",
    },
  ],
  type: { type: String, default: "donation" },
  createdAt: { type: Date, default: Date.now },
});

const Supplies = mongoose.model("Supplies", SuppliesSchema);
export default Supplies;
