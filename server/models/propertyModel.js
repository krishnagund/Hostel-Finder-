import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  properttyType: {type : String,required : true},
  address: {type : String,required : true},
  state: {type : String,required : true},
  city: {type : String,required : true},
  postalCode: {type : String,required : true},
  phone: {type : String,required : true},
  email: {type : String,required : true},
  rent: {type : String,required : true},
  deposit: {type : String,required : true},
  availabilityMonth: {type : String,required : true},
  availabilityDay: {type : Number,required : true},
  heading: String,
  roomImages: [String],
  latitude: Number,
  longitude: Number,
  isAvailable: {
    type: Boolean,
    default: true
  },
  // Indian college/hostel specific fields
  collegeName: String,
  distanceFromCollege: String,
  coursePreferences: String,
  // Room and facility details
  roomSize: String,
  furniture: [String],
  acAvailable: { type: Boolean, default: false },
  fanAvailable: { type: Boolean, default: false },
  attachedBathroom: { type: Boolean, default: false },
  balcony: { type: Boolean, default: false },
  // Hostel amenities
  wifiAvailable: { type: Boolean, default: false },
  laundryService: { type: Boolean, default: false },
  messAvailable: { type: Boolean, default: false },
  commonRoom: { type: Boolean, default: false },
  studyRoom: { type: Boolean, default: false },
  gymAvailable: { type: Boolean, default: false },
  // Food options
  kitchenAccess: { type: Boolean, default: false },
  nearbyRestaurants: String,
  // Safety and security
  cctvAvailable: { type: Boolean, default: false },
  securityGuard: { type: Boolean, default: false },
  femaleOnly: { type: Boolean, default: false },
  // Transportation
  busStopDistance: String,
  metroStationDistance: String,
  autoRickshawAvailable: { type: Boolean, default: false },
  // Rules and policies
  visitorPolicy: String,
  curfewTiming: String,
  guestPolicy: String,
  // Payment terms
  advancePayment: String,
  monthlyPayment: String,
  lateFeePolicy: String,
  // Additional details
  rules: String,
  // Indian-specific utilities
  electricityBackup: { type: Boolean, default: false },
  waterSupply: String,
  maintenance: String,
  // Additional amenities
  parkingAvailable: { type: Boolean, default: false },
  liftAvailable: { type: Boolean, default: false },
  powerBackup: { type: Boolean, default: false },
  // Property verification status
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  // Admin verification details
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  verifiedAt: Date,
  rejectionReason: String,
  // Additional fields for better property management
  description: String,
  community: String,
  featured: {
    type: Boolean,
    default: false
  },
  // Admin notification system
  adminNotification: {
    hasNewRequest: {
      type: Boolean,
      default: false
    },
    notificationSeen: {
      type: Boolean,
      default: false
    },
    lastNotificationAt: Date
  }
}, { timestamps: true });

export default mongoose.model('Property', propertySchema);
