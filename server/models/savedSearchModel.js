import mongoose from "mongoose";

const savedSearchSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    city: { type: String, required: true },
    rentMin: { type: Number, default: 0 },
    rentMax: { type: Number, default: 100000 },
    types: { type: [String], default: [] },
    availabilityMonth: { type: String, default: "" },
    availabilityDay: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

savedSearchSchema.index({ user: 1, city: 1, rentMin: 1, rentMax: 1, availabilityMonth: 1, availabilityDay: 1, types: 1 }, { unique: false });

const SavedSearch = mongoose.models.SavedSearch || mongoose.model("SavedSearch", savedSearchSchema);

export default SavedSearch;


