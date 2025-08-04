import Property from '../models/propertyModel.js';
import { getCoordinatesFromAddress } from '../utils/geocode.js';

export const createProperty = async (req, res) => {
  try {
    const userId = req.userId;
    const {
      properttyType, address, state, city, postalCode, phone, email,
      rent, deposit, leaseTerm, availabilityMonth, availabilityDay,
      heading, roomImages, description, community
    } = req.body;

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


export const getPropertiesByCity = async (req, res) => {
  const city = req.params.city;

  try {
    const properties = await Property.find({
      city: { $regex: new RegExp(`^${city}$`, 'i') } // Case-insensitive match
    });

    res.status(200).json({ success: true, properties });
  } catch (err) {
    console.error("Error fetching properties by city:", err);
    res.status(500).json({ message: 'Error fetching city properties', error: err.message });
  }
};
