import Property from '../models/propertyModel.js';

export const createProperty = async (req, res) => {
  try {
    const userId = req.userId;
    const newProperty = new Property({ ...req.body, user: userId });
    await newProperty.save();
    res.status(201).json({ success: true, property: newProperty });
  } catch (err) {
    res.status(500).json({ message: 'Error saving property', error: err.message });
  }
};

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
    // Sort by most recently created first (descending order)
    const properties = await Property.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, properties });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching all properties', error: err.message });
  }
};
