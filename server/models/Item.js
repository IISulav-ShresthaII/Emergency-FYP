import mongoose from "mongoose";

const ItemsSchema = new mongoose.Schema({
  name: { type: String, default: "No Name" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  description: { type: String, default: "Without description" },
  type: { type: String, enum: ["Report", "Help"], required: true },
  location: { type: String, required: true },
  latitude: { type: Number, required: true }, // Added latitude field
  longitude: { type: Number, required: true }, // Added longitude field
  date: { type: String, required: true },
  number: { type: String, required: true },
  img: [
    {
      type: String,
      default: "https://i.ibb.co/DpZ3qy2/Untitled-design-10.png",
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

const Item = mongoose.model("Item", ItemsSchema);
export default Item;
