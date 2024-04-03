import mongoose from "mongoose";

const PreparednessSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  img: [
    {
      type: String,
      default: "https://i.ibb.co/DpZ3qy2/Untitled-design-10.png",
    },
  ],
  createdAt: { type: Date, default: Date.now },
});
const Preparedness = mongoose.model("Preparedness", PreparednessSchema);
export default Preparedness;
