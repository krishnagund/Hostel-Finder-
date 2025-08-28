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
    await userModel.findByIdAndDelete(req.params.id);
    return res.json({ success: true, message: "User deleted" });
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
    await propertyModel.findByIdAndDelete(req.params.id);
    return res.json({ success: true, message: "Property deleted" });
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
