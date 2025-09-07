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
  rent: {type : Number,required : true},
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
