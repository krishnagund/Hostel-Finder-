import Message from "../models/messageModel.js";
import Property from "../models/propertyModel.js";
import userModel from "../models/userModel.js";

export const sendMessage = async (req, res) => {
  try {
    const { propertyId, name, email, phone, moveInDate, message } = req.body;

    if (!propertyId || !email || !message) {
      return res.status(400).json({ success: false, message: "propertyId, email and message are required" });
    }


    const property = await Property.findById(propertyId).select("user heading city rent");
    if (!property) return res.status(404).json({ success: false, message: "Property not found" });

    const sender = await userModel.findOne({ email: email.trim().toLowerCase() }).select("_id name email");
    if (!sender) {
      return res.status(401).json({ success: false, needsAuth: true, message: "Email not registered" });
    }

    const receiverId = property.user;

    const doc = await Message.create({
      property: property._id,
      sender: sender._id,
      receiver: receiverId,
      name,
      email: sender.email,
      phone,
      moveInDate,
      content: message,
    });

    return res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: doc,
    });

  } catch (err) {
    console.error("sendMessage error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getMyMessages = async (req, res) => {
  try {
    const userId = req.userId;

    const messages = await Message.find({ receiver: userId })
      .populate("property", "heading city rent")
      .populate("sender", "name email phone")
      .sort({ createdAt: -1 });

    return res.json({ success: true, messages });
  } catch (err) {
    console.error("getMyMessages error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


export const markMessagesRead = async (req, res) => {
  try {
    const { email } = req.body;
    const userId = req.userId;

    if (!email) return res.status(400).json({ success: false, message: "Email required" });

    await Message.updateMany({ receiver: userId, email }, { read: true });

    return res.json({ success: true, message: "Messages marked as read" });
  } catch (err) {
    console.error("markMessagesRead error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getStudentMessages = async (req, res) => {
  try {
    const studentId = req.userId;

    const messages = await Message.find({ receiver: studentId })
      .populate("sender","name email phone")       // include owner details
      .populate("property", "heading city rent phone email") // include property details & contact info
      .sort({ createdAt: -1 });

    res.json({ success: true, messages });
  } catch (err) {
    console.error("getStudentMessages error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};





export const logMessage = async (req, res) => {
  try {
    const { receiverId, medium, content = "", propertyId } = req.body;

    const owner = await userModel.findById(req.userId);
    if (!owner) return res.status(404).json({ success: false, message: "Owner not found" });

    const newLog = new Message({
      property: propertyId,
      sender: owner._id,       
      receiver: receiverId,
      medium,                  
      content,                
    });

    await newLog.save();

    return res.json({ success: true, message: "Interaction logged successfully" });
  } catch (err) {
    console.error("logMessage error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


export const markas = async (req, res) => {
  try {
    const { propertyId } = req.body;
    const userId = req.userId;

    if (!propertyId) {
      return res.status(400).json({ success: false, message: "Property ID required" });
    }

    await Message.updateMany(
      { receiver: userId, property: propertyId },
      { read: true }
    );

    return res.json({ success: true, message: "Messages marked as read" });
  } catch (err) {
    console.error("markMessagesRead error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
