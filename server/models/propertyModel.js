import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  properttyType: String,
  address: String,
  state: String,
  city: String,
  postalCode: String,
  phone: String,
  email: String,
  rent: Number,
  deposit: String,
  leaseTerm: String,
  availabilityMonth: String,
  availabilityDay: String,
  heading: String,
  roomImages: [String]
}, { timestamps: true });

export default mongoose.model('Property', propertySchema);
