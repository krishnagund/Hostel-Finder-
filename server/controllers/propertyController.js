import Property from '../models/propertyModel.js';
import userModel from '../models/userModel.js';
import { getCoordinatesFromAddress } from '../utils/geocode.js';
import transporter, { EMAIL_CONFIG } from '../config/nodemailer.js';
import { PROPERTY_VERIFICATION_REQUEST_TEMPLATE, ADMIN_PROPERTY_REQUEST_TEMPLATE } from '../config/emailTemplates.js';

export const createProperty = async (req, res) => {
  try {
    const userId = req.userId;

    const {
      properttyType, address, state, city, postalCode, phone, email,
      rent, deposit, leaseTerm, availabilityMonth, availabilityDay,
      heading, description, community
    } = req.body;

    const roomImages = (req.files || []).map(file => file.path);

    const fullAddress = `${city},${postalCode}, India`;
    const { latitude, longitude } = await getCoordinatesFromAddress(fullAddress);

    const newProperty = new Property({
      user: userId,
      properttyType,
      address,
      state,
      city,
      postalCode,
      phone,
      email,
      rent,
      deposit,
      leaseTerm,                
      availabilityMonth,
      availabilityDay,
      heading,
      roomImages,               
      description,
      community,
      latitude,
      longitude,
      // Set admin notification for new property request
      adminNotification: {
        hasNewRequest: true,
        notificationSeen: false,
        lastNotificationAt: new Date()
      }
    });

    await newProperty.save();

    // Send verification request email to property owner
    try {
      const owner = await userModel.findById(userId);
      if (owner && owner.email) {
        const mailOptions = {
          from: `"${EMAIL_CONFIG.from.name}" <${EMAIL_CONFIG.from.address}>`,
          to: owner.email,
          subject: 'Property Verification Request - Hostel Finder',
          replyTo: EMAIL_CONFIG.replyTo,
          html: PROPERTY_VERIFICATION_REQUEST_TEMPLATE
            .replace("{{ownerName}}", owner.name || 'Property Owner')
            .replace("{{propertyTitle}}", heading || 'Your Property')
            .replace("{{propertyLocation}}", `${city}, ${state}`)
            .replace("{{propertyRent}}", rent)
            .replace("{{submissionDate}}", new Date().toLocaleDateString())
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
        console.log('✅ Property verification request email sent to:', owner.email);
      }
    } catch (emailError) {
      console.error('❌ Error sending property verification email:', emailError);
      // Don't fail the property creation if email fails
    }

    // Send admin notification email
    try {
      if (EMAIL_CONFIG.company.adminEmail) {
        const adminMailOptions = {
          from: `"${EMAIL_CONFIG.from.name}" <${EMAIL_CONFIG.from.address}>`,
          to: EMAIL_CONFIG.company.adminEmail,
          subject: 'New Property Verification Request - Hostel Finder',
          replyTo: EMAIL_CONFIG.replyTo,
          html: ADMIN_PROPERTY_REQUEST_TEMPLATE
            .replace("{{propertyTitle}}", heading || 'New Property Listing')
            .replace("{{propertyType}}", properttyType)
            .replace("{{propertyLocation}}", `${city}, ${state}`)
            .replace("{{propertyRent}}", rent)
            .replace("{{ownerName}}", owner?.name || 'Property Owner')
            .replace("{{ownerEmail}}", owner?.email || email)
            .replace("{{submissionDate}}", new Date().toLocaleDateString())
            .replace("{{adminPanelUrl}}", EMAIL_CONFIG.company.adminPanelUrl)
            .replace("{{logo}}", EMAIL_CONFIG.company.logo)
            .replace("{{website}}", EMAIL_CONFIG.company.website),
          headers: {
            'X-Mailer': 'Hostel Finder Admin System',
            'X-Priority': '1', // High priority for admin notifications
            'X-MSMail-Priority': 'High',
            'Importance': 'High'
          }
        };

        await transporter.sendMail(adminMailOptions);
        console.log('✅ Admin notification email sent to:', EMAIL_CONFIG.company.adminEmail);
      }
    } catch (adminEmailError) {
      console.error('❌ Error sending admin notification email:', adminEmailError);
      // Don't fail the property creation if admin email fails
    }

    res.status(201).json({ 
      success: true, 
      property: newProperty,
      message: 'Property submitted for verification. It will be visible after admin approval.'
    });
  }catch (err) {
  console.error("❌ Property creation error:");
  console.dir(err, { depth: null });  // shows nested objects
  res.status(500).json({
    success: false,
    message: err.message || "Unknown error",
    error: err,  // send full object to frontend
  });
}
}

export const getUserProperties = async (req, res) => {
  try {
    const userId = req.userId; // from userAuth middleware
    const properties = await Property.find({ user: userId });
    res.status(200).json({ success: true, properties });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching properties', error: err.message });
  }
};

export const getAllProperties = async (req, res) => {
  try {
    // Only show approved and available properties to public
    const properties = await Property.find({ 
      status: 'approved',
      isAvailable: true 
    }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, properties });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching all properties', error: err.message });
  }
};


export const getPropertiesByCity = async (req, res) => {
  const city = req.params.city;

  try {
    // Only show approved and available properties by city
    const properties = await Property.find({
      city: { $regex: new RegExp(`^${city}$`, 'i') },
      status: 'approved',
      isAvailable: true
    });

    res.status(200).json({ success: true, properties });
  } catch (err) {
    console.error("Error fetching properties by city:", err);
    res.status(500).json({ message: 'Error fetching city properties', error: err.message });
  }
};

export const updateProperty = async (req, res) => {
  try {
    const userId = req.userId;
    const propertyId = req.params.id;
    const updateData = req.body;

    // Check if property belongs to user
    const property = await Property.findOne({ _id: propertyId, user: userId });
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found or unauthorized' });
    }

    // Update property
    const updatedProperty = await Property.findByIdAndUpdate(
      propertyId,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, property: updatedProperty });
  } catch (err) {
    console.error("Error updating property:", err);
    res.status(500).json({ success: false, message: 'Error updating property', error: err.message });
  }
};

export const deleteProperty = async (req, res) => {
  try {
    const userId = req.userId;
    const propertyId = req.params.id;

    // Check if property belongs to user
    const property = await Property.findOne({ _id: propertyId, user: userId });
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found or unauthorized' });
    }

    // Import Message model for cascading delete
    const Message = (await import('../models/messageModel.js')).default;

    // Delete all messages associated with this property
    await Message.deleteMany({ property: propertyId });

    // Delete the property
    await Property.findByIdAndDelete(propertyId);
    
    res.status(200).json({ success: true, message: 'Property and associated messages deleted successfully' });
  } catch (err) {
    console.error("Error deleting property:", err);
    res.status(500).json({ success: false, message: 'Error deleting property', error: err.message });
  }
};

export const toggleAvailability = async (req, res) => {
  try {
    const userId = req.userId;
    const propertyId = req.params.id;

    // Check if property belongs to user
    const property = await Property.findOne({ _id: propertyId, user: userId });
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found or unauthorized' });
    }

    // Toggle availability
    const updatedProperty = await Property.findByIdAndUpdate(
      propertyId,
      { isAvailable: !property.isAvailable },
      { new: true }
    );

    res.status(200).json({ 
      success: true, 
      property: updatedProperty,
      message: `Property ${updatedProperty.isAvailable ? 'marked as available' : 'marked as unavailable'}`
    });
  } catch (err) {
    console.error("Error toggling availability:", err);
    res.status(500).json({ success: false, message: 'Error toggling availability', error: err.message });
  }
};