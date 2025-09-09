// Tour configurations for different user types and pages

export const ownerDashboardTour = {
  name: 'ownerDashboard',
  title: 'Property Owner Dashboard Tour',
  steps: [
    {
      target: '[data-tour="list-property"]',
      title: 'List Your Property',
      content: 'Click here to add a new property listing. You can provide detailed information about your property to attract students.',
      icon: '🏠',
      tourName: 'ownerDashboard'
    },
    {
      target: '[data-tour="inbox"]',
      title: 'Manage Inquiries',
      content: 'Check your inbox to see messages from interested students. Respond to inquiries and manage your conversations here.',
      icon: '📧',
      tourName: 'ownerDashboard'
    },
    {
      target: '[data-tour="my-properties"]',
      title: 'My Properties',
      content: 'View and manage all your listed properties. Edit details, update availability, or remove listings.',
      icon: '📋',
      tourName: 'ownerDashboard'
    },
    {
      target: '[data-tour="profile"]',
      title: 'Profile Settings',
      content: 'Update your profile information, contact details, and account settings.',
      icon: '👤',
      tourName: 'ownerDashboard'
    }
  ]
};

export const propertyFormTour = {
  name: 'propertyForm',
  title: 'Property Listing Form Tour',
  steps: [
    {
      target: '[data-tour="property-type"]',
      title: 'Choose Property Type',
      content: 'Select the type of accommodation you\'re offering - PG, Hostel, Single Room, etc.',
      icon: '🏠',
      tourName: 'propertyForm'
    },
    {
      target: '[data-tour="location"]',
      title: 'Property Location',
      content: 'Enter the complete address, state, and city so students can find it easily.',
      icon: '📍',
      tourName: 'propertyForm'
    },
    {
      target: '[data-tour="college-info"]',
      title: 'College Information',
      content: 'Specify the nearest college/university and the distance.',
      icon: '🎓',
      tourName: 'propertyForm'
    },
    {
      target: '[data-tour="pricing"]',
      title: 'Pricing Details',
      content: 'Set your monthly rent and security deposit clearly.',
      icon: '💰',
      tourName: 'propertyForm'
    },
    {
      target: '[data-tour="amenities"]',
      title: 'Amenities & Facilities',
      content: 'Select all available amenities like WiFi, laundry, mess, etc.',
      icon: '⭐',
      tourName: 'propertyForm'
    },
    {
      target: '[data-tour="images"]',
      title: 'Property Images',
      content: 'Upload clear, high-quality images of your property.',
      icon: '📸',
      tourName: 'propertyForm'
    }
  ]
};

export const studentDashboardTour = {
  name: 'studentDashboard',
  title: 'Student Dashboard Tour',
  steps: [
    {
      target: '[data-tour="search-properties"]',
      title: 'Search Properties',
      content: 'Use the search to find properties near your college and apply filters.',
      icon: '🔍',
      tourName: 'studentDashboard'
    },
    {
      target: '[data-tour="favorites"]',
      title: 'Saved Properties',
      content: 'Save properties you like and compare them later.',
      icon: '❤️',
      tourName: 'studentDashboard'
    },
    {
      target: '[data-tour="messages"]',
      title: 'Messages',
      content: 'Check your conversations with property owners.',
      icon: '💬',
      tourName: 'studentDashboard'
    },
    {
      target: '[data-tour="profile"]',
      title: 'Student Profile',
      content: 'Complete your profile for better property matches.',
      icon: '👤',
      tourName: 'studentDashboard'
    }
  ]
};

// Helper function to get tour configuration
export const getTourConfig = (tourName) => {
  const tours = {
    ownerDashboard: ownerDashboardTour,
    propertyForm: propertyFormTour,
    studentDashboard: studentDashboardTour
  };
  return tours[tourName] || null;
};

// Helper function to check if user should see tour
export const shouldShowTour = (tourName, userType, isFirstTime = false) => {
  if (isFirstTime) return true;
  if (userType === 'owner' && ['ownerDashboard', 'propertyForm'].includes(tourName)) return true;
  if (userType === 'student' && tourName === 'studentDashboard') return true;
  return false;
};


