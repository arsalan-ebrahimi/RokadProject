import mongoose from "mongoose";

const awardSchema = new mongoose.Schema({
  title: {
    type: String,
    unique: true,
    required: [true, "title is required"],
  },

});

const Award = mongoose.model("Award", awardSchema);
export default Award;
