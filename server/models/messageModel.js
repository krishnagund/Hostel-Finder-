import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    property: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },

    name: String,
    email: String,
    phone: String,
    moveInDate: Date,

    content: { type: String },

    medium: {
      type: String,
      enum: ["form", "whatsapp", "sms", "call", "email"], 
    },

    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);
