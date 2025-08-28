import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  properttyType: {type : String,required : true},
  address: {type : String,required : true},
  state: {type : String,required : true},
  city: {type : String,required : true},
  postalCode: {type : String,required : true},
  phone: {type : String,required : true},
  email: {type : String,required : true},
  rent: {type : Number,required : true},
  deposit: {type : String,required : true},
  availabilityMonth: {type : String,required : true},
  availabilityDay: {type : Number,required : true},
  heading: String,
  roomImages: [String],
  latitude: Number,
  longitude: Number,
}, { timestamps: true });

export default mongoose.model('Property', propertySchema);
