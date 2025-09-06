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

    // No email or SMS notifications - removed as requested

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

    // Filter out messages where property or sender is null (deleted)
    const validMessages = messages.filter(msg => msg.property && msg.sender);

    return res.json({ success: true, messages: validMessages });
  } catch (err) {
    console.error("getMyMessages error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.userId;
    
    // Get unread messages and filter out those with deleted references
    const unreadMessages = await Message.find({ 
      receiver: userId, 
      read: false 
    })
    .populate("property")
    .populate("sender");

    // Filter out messages where property or sender is null (deleted)
    const validUnreadMessages = unreadMessages.filter(msg => msg.property && msg.sender);
    const unreadCount = validUnreadMessages.length;

    return res.json({ success: true, unreadCount });
  } catch (err) {
    console.error("getUnreadCount error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


export const markMessagesRead = async (req, res) => {
  try {
    const { email } = req.body;
    const userId = req.userId;

    if (!email) return res.status(400).json({ success: false, message: "Email required" });
    
    // Normalize the email to match how it's stored in the database
    const normalizedEmail = email.trim().toLowerCase();
    
    // Try to find the sender by email to get the correct email format
    const sender = await userModel.findOne({ email: normalizedEmail }).select("email");
    const senderEmail = sender ? sender.email : normalizedEmail;
    
    const result = await Message.updateMany({ receiver: userId, email: senderEmail }, { read: true });

    return res.json({ 
      success: true, 
      message: "Messages marked as read",
      modifiedCount: result.modifiedCount
    });
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

    // Filter out messages where property or sender is null (deleted)
    const validMessages = messages.filter(msg => msg.property && msg.sender);

    res.json({ success: true, messages: validMessages });
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

    if (!propertyId) {
      return res.status(400).json({ success: false, message: "propertyId is required" });
    }
    if (!receiverId) {
      return res.status(400).json({ success: false, message: "receiverId is required" });
    }

    // Validate that property exists and belongs to this owner
    const property = await Property.findById(propertyId).select("user heading");
    if (!property) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }
    if (String(property.user) !== String(owner._id)) {
      return res.status(403).json({ success: false, message: "You do not own this property" });
    }

    const newLog = new Message({
      property: property._id,
      sender: owner._id,
      receiver: receiverId,
      medium,
      content,
    });

    await newLog.save();

    // No email or SMS notifications - removed as requested

    return res.json({ success: true, message: "Interaction logged successfully" });
  } catch (err) {
    console.error("logMessage error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


export const markas = async (req, res) => {
  try {
    const { email } = req.body;
    const userId = req.userId;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email required" });
    }
    
    // Find the sender by email to get their ID
    const normalizedEmail = email.trim().toLowerCase();
    const sender = await userModel.findOne({ email: normalizedEmail }).select("_id email");
    
    if (!sender) {
      return res.json({ 
        success: false, 
        message: "Sender not found",
        modifiedCount: 0
      });
    }
    
    // Try updating by sender ID instead of email
    const result = await Message.updateMany(
      { receiver: userId, sender: sender._id },
      { read: true }
    );

    return res.json({ 
      success: true, 
      message: "Messages marked as read",
      modifiedCount: result.modifiedCount
    });
  } catch (err) {
    console.error("markMessagesRead error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
