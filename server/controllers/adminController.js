import userModel from "../models/userModel.js";
import propertyModel from "../models/propertyModel.js";

// ----- DASHBOARD STATS -----
export const getStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalStudents,
      totalOwners,
      totalAdmins,
      totalProps,
      pendingProps,
      approvedProps,
      rejectedProps,
    ] = await Promise.all([
      userModel.countDocuments({}),
      userModel.countDocuments({ role: "student" }),
      userModel.countDocuments({ role: "owner" }),
      userModel.countDocuments({ role: "admin" }),
      propertyModel.countDocuments({}),
      propertyModel.countDocuments({ status: "pending" }),
      propertyModel.countDocuments({ status: "approved" }),
      propertyModel.countDocuments({ status: "rejected" }),
    ]);

    return res.json({
      success: true,
      stats: {
        users: { total: totalUsers, students: totalStudents, owners: totalOwners, admins: totalAdmins },
        properties: { total: totalProps, pending: pendingProps, approved: approvedProps, rejected: rejectedProps },
      },
    });
  } catch (e) {
    return res.json({ success: false, message: e.message });
  }
};

// ----- USERS -----
export const listUsers = async (req, res) => {
  try {
    const users = await userModel.find().select("-password").sort({ createdAt: -1 });
    return res.json({ success: true, users });
  } catch (e) {
    return res.json({ success: false, message: e.message });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!["student", "owner", "admin"].includes(role)) {
      return res.json({ success: false, message: "Invalid role" });
    }
    await userModel.findByIdAndUpdate(req.params.id, { role });
    return res.json({ success: true, message: "Role updated" });
  } catch (e) {
    return res.json({ success: false, message: e.message });
  }
};

export const toggleBlockUser = async (req, res) => {
  try {
    const u = await userModel.findById(req.params.id);
    if (!u) return res.json({ success: false, message: "User not found" });
    u.isBlocked = !u.isBlocked;
    await u.save();
    return res.json({ success: true, message: u.isBlocked ? "User blocked" : "User unblocked" });
  } catch (e) {
    return res.json({ success: false, message: e.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Import models for cascading delete
    const Message = (await import('../models/messageModel.js')).default;
    
    // Get user to check their role
    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    
    // If user is an owner, delete all their properties and associated messages
    if (user.role === 'owner') {
      // Find all properties owned by this user
      const userProperties = await propertyModel.find({ user: userId });
      const propertyIds = userProperties.map(prop => prop._id);
      
      // Delete all messages associated with these properties
      await Message.deleteMany({ property: { $in: propertyIds } });
      
      // Delete all properties owned by this user
      await propertyModel.deleteMany({ user: userId });
    }
    
    // Delete all messages where this user is sender or receiver
    await Message.deleteMany({ 
      $or: [
        { sender: userId },
        { receiver: userId }
      ]
    });
    
    // Remove this user from all favorites lists
    await userModel.updateMany(
      { favorites: userId },
      { $pull: { favorites: userId } }
    );
    
    // Finally, delete the user
    await userModel.findByIdAndDelete(userId);
    
    return res.json({ success: true, message: "User and all associated data deleted" });
  } catch (e) {
    return res.json({ success: false, message: e.message });
  }
};

// ----- PROPERTIES -----
export const listProperties = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    const props = await propertyModel.find(filter).sort({ createdAt: -1 });
    return res.json({ success: true, properties: props });
  } catch (e) {
    return res.json({ success: false, message: e.message });
  }
};

export const approveProperty = async (req, res) => {
  try {
    await propertyModel.findByIdAndUpdate(req.params.id, { status: "approved" });
    return res.json({ success: true, message: "Property approved" });
  } catch (e) {
    return res.json({ success: false, message: e.message });
  }
};

export const rejectProperty = async (req, res) => {
  try {
    await propertyModel.findByIdAndUpdate(req.params.id, { status: "rejected" });
    return res.json({ success: true, message: "Property rejected" });
  } catch (e) {
    return res.json({ success: false, message: e.message });
  }
};

export const deleteProperty = async (req, res) => {
  try {
    const propertyId = req.params.id;
    
    // Import Message model for cascading delete
    const Message = (await import('../models/messageModel.js')).default;
    
    // Delete all messages associated with this property
    await Message.deleteMany({ property: propertyId });
    
    // Delete the property
    await propertyModel.findByIdAndDelete(propertyId);
    
    return res.json({ success: true, message: "Property and associated messages deleted" });
  } catch (e) {
    return res.json({ success: false, message: e.message });
  }
};

export const toggleFeatureProperty = async (req, res) => {
  try {
    const prop = await propertyModel.findById(req.params.id);
    if (!prop) return res.json({ success: false, message: "Property not found" });
    prop.featured = !prop.featured;
    await prop.save();
    return res.json({ success: true, message: prop.featured ? "Featured" : "Unfeatured" });
  } catch (e) {
    return res.json({ success: false, message: e.message });
  }
};
