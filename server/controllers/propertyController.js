import Property from '../models/propertyModel.js';
import { getCoordinatesFromAddress } from '../utils/geocode.js';

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
    });

    await newProperty.save();
    res.status(201).json({ success: true, property: newProperty });
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
    const properties = await Property.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, properties });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching all properties', error: err.message });
  }
};


export const getPropertiesByCity = async (req, res) => {
  const city = req.params.city;

  try {
    const properties = await Property.find({
      city: { $regex: new RegExp(`^${city}$`, 'i') } 
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