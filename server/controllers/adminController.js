import userModel from "../models/userModel.js";
import propertyModel from "../models/propertyModel.js";
import transporter, { EMAIL_CONFIG } from '../config/nodemailer.js';
import { PROPERTY_APPROVED_TEMPLATE } from '../config/emailTemplates.js';

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
    
    const props = await propertyModel.find(filter)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });
    return res.json({ success: true, properties: props });
  } catch (e) {
    return res.json({ success: false, message: e.message });
  }
};

export const approveProperty = async (req, res) => {
  try {
    const adminId = req.userId;
    const propertyId = req.params.id;
    
    const updatedProperty = await propertyModel.findByIdAndUpdate(
      propertyId, 
      { 
        status: "approved",
        verifiedBy: adminId,
        verifiedAt: new Date(),
        rejectionReason: undefined, // Clear any previous rejection reason
        // Clear admin notification since action is taken
        'adminNotification.hasNewRequest': false,
        'adminNotification.notificationSeen': true
      },
      { new: true }
    ).populate('user', 'name email');
    
    if (!updatedProperty) {
      return res.json({ success: false, message: "Property not found" });
    }
    
    // Send approval email to property owner
    try {
      const owner = updatedProperty.user;
      if (owner && owner.email) {
        const mailOptions = {
          from: `"${EMAIL_CONFIG.from.name}" <${EMAIL_CONFIG.from.address}>`,
          to: owner.email,
          subject: 'Property Approved - Hostel Finder',
          replyTo: EMAIL_CONFIG.replyTo,
          html: PROPERTY_APPROVED_TEMPLATE
            .replace("{{ownerName}}", owner.name || 'Property Owner')
            .replace("{{propertyTitle}}", updatedProperty.heading || 'Your Property')
            .replace("{{propertyLocation}}", `${updatedProperty.city}, ${updatedProperty.state}`)
            .replace("{{propertyRent}}", updatedProperty.rent)
            .replace("{{approvalDate}}", new Date().toLocaleDateString())
            .replace("{{propertyUrl}}", `${EMAIL_CONFIG.company.website}/property/${propertyId}`)
            .replace("{{logo}}", EMAIL_CONFIG.company.logo)
            .replace("{{website}}", EMAIL_CONFIG.company.website)
            .replace("{{supportEmail}}", EMAIL_CONFIG.company.supportEmail),
          headers: {
            'X-Mailer': 'Hostel Finder',
            'X-Priority': '3',
            'X-MSMail-Priority': 'Normal',
            'Importance': 'Normal'
          }
        };

        await transporter.sendMail(mailOptions);
        console.log('✅ Property approval email sent to:', owner.email);
      }
    } catch (emailError) {
      console.error('❌ Error sending property approval email:', emailError);
      // Don't fail the approval if email fails
    }
    
    return res.json({ success: true, message: "Property approved successfully" });
  } catch (e) {
    return res.json({ success: false, message: e.message });
  }
};

export const rejectProperty = async (req, res) => {
  try {
    const adminId = req.userId;
    const propertyId = req.params.id;
    const { rejectionReason } = req.body;
    
    const updatedProperty = await propertyModel.findByIdAndUpdate(
      propertyId, 
      { 
        status: "rejected",
        verifiedBy: adminId,
        verifiedAt: new Date(),
        rejectionReason: rejectionReason || "Property does not meet our quality standards",
        // Clear admin notification since action is taken
        'adminNotification.hasNewRequest': false,
        'adminNotification.notificationSeen': true
      },
      { new: true }
    );
    
    if (!updatedProperty) {
      return res.json({ success: false, message: "Property not found" });
    }
    
    return res.json({ success: true, message: "Property rejected successfully" });
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
    
    // Only allow featuring approved properties
    if (prop.status !== 'approved') {
      return res.json({ success: false, message: "Only approved properties can be featured" });
    }
    
    prop.featured = !prop.featured;
    await prop.save();
    return res.json({ success: true, message: prop.featured ? "Property featured" : "Property unfeatured" });
  } catch (e) {
    return res.json({ success: false, message: e.message });
  }
};

// New function to get property details for admin review
export const getPropertyDetails = async (req, res) => {
  try {
    const propertyId = req.params.id;
    
    const property = await propertyModel.findById(propertyId)
      .populate('user', 'name email phone')
      .populate('verifiedBy', 'name email');
    
    if (!property) {
      return res.json({ success: false, message: "Property not found" });
    }
    
    return res.json({ success: true, property });
  } catch (e) {
    return res.json({ success: false, message: e.message });
  }
};

// Get notification count for admin dashboard
export const getNotificationCount = async (req, res) => {
  try {
    const pendingCount = await propertyModel.countDocuments({ 
      status: 'pending',
      'adminNotification.hasNewRequest': true,
      'adminNotification.notificationSeen': false
    });
    
    return res.json({ 
      success: true, 
      notificationCount: pendingCount 
    });
  } catch (e) {
    return res.json({ success: false, message: e.message });
  }
};

// Mark all notifications as seen
export const markNotificationsSeen = async (req, res) => {
  try {
    await propertyModel.updateMany(
      { 
        status: 'pending',
        'adminNotification.hasNewRequest': true,
        'adminNotification.notificationSeen': false
      },
      { 
        'adminNotification.notificationSeen': true 
      }
    );
    
    return res.json({ 
      success: true, 
      message: "All notifications marked as seen" 
    });
  } catch (e) {
    return res.json({ success: false, message: e.message });
  }
};
