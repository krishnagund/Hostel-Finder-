import { State, City } from "country-state-city";
import { useState, useContext, useEffect } from "react";
import { AppContext } from "../context/Appcontext";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import RenterInfo from "./RenterInfo";
import TranslatedText from "./TranslatedText";

const PropertyForm = ({ propertyType, onBack, editProperty = null }) => {
  const navigate = useNavigate();
  const { backendurl, userData } = useContext(AppContext);
  const [formData, setFormData] = useState({
    properttyType: "",
    address: "",
    state: "",
    city: "",
    postalCode: "",
    phone: "",
    email: "",
    rent: "",
    deposit: "",
    availabilityMonth: "",
    availabilityDay: "",
    heading: "",
    // Indian college/hostel specific fields
    collegeName: "",
    distanceFromCollege: "",
    coursePreferences: "",
    // Room and facility details
    roomSize: "",
    furniture: [],
    acAvailable: false,
    fanAvailable: false,
    attachedBathroom: false,
    balcony: false,
    // Hostel amenities
    wifiAvailable: false,
    laundryService: false,
    messAvailable: false,
    commonRoom: false,
    studyRoom: false,
    gymAvailable: false,
    // Food options
    kitchenAccess: false,
    nearbyRestaurants: "",
    // Safety and security
    cctvAvailable: false,
    securityGuard: false,
    femaleOnly: false,
    // Transportation
    busStopDistance: "",
    metroStationDistance: "",
    autoRickshawAvailable: false,
    // Rules and policies
    visitorPolicy: "",
    curfewTiming: "",
    guestPolicy: "",
    // Payment terms
    advancePayment: "",
    monthlyPayment: "",
    lateFeePolicy: "",
    // Additional details
    description: "",
    community: "",
    rules: "",
    // Indian-specific utilities
    electricityBackup: false,
    waterSupply: "",
    maintenance: "",
    // Additional amenities
    parkingAvailable: false,
    liftAvailable: false,
    powerBackup: false,
  });
  const [roomImages, setRoomImages] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [existingImages, setExistingImages] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;

  // Pre-populate email and phone from logged-in user data
  useEffect(() => {
    if (userData) {
      setFormData(prev => ({
        ...prev,
        email: userData.email || "",
        phone: userData.phone || ""
      }));
    }
  }, [userData]);

  // Populate form data when editing
  useEffect(() => {
    if (editProperty) {
      setFormData({
        properttyType: editProperty.properttyType || "",
        address: editProperty.address || "",
        state: editProperty.state || "",
        city: editProperty.city || "",
        postalCode: editProperty.postalCode || "",
        phone: editProperty.phone || "",
        email: editProperty.email || "",
        rent: editProperty.rent || "",
        deposit: editProperty.deposit || "",
        availabilityMonth: editProperty.availabilityMonth || "",
        availabilityDay: editProperty.availabilityDay || "",
        heading: editProperty.heading || "",
        // Indian college/hostel specific fields
        collegeName: editProperty.collegeName || "",
        distanceFromCollege: editProperty.distanceFromCollege || "",
        coursePreferences: editProperty.coursePreferences || "",
        // Room and facility details
        roomSize: editProperty.roomSize || "",
        furniture: editProperty.furniture || [],
        acAvailable: editProperty.acAvailable || false,
        fanAvailable: editProperty.fanAvailable || false,
        attachedBathroom: editProperty.attachedBathroom || false,
        balcony: editProperty.balcony || false,
        // Hostel amenities
        wifiAvailable: editProperty.wifiAvailable || false,
        laundryService: editProperty.laundryService || false,
        messAvailable: editProperty.messAvailable || false,
        commonRoom: editProperty.commonRoom || false,
        studyRoom: editProperty.studyRoom || false,
        gymAvailable: editProperty.gymAvailable || false,
        // Food options
        kitchenAccess: editProperty.kitchenAccess || false,
        nearbyRestaurants: editProperty.nearbyRestaurants || "",
        // Safety and security
        cctvAvailable: editProperty.cctvAvailable || false,
        securityGuard: editProperty.securityGuard || false,
        femaleOnly: editProperty.femaleOnly || false,
        // Transportation
        busStopDistance: editProperty.busStopDistance || "",
        metroStationDistance: editProperty.metroStationDistance || "",
        autoRickshawAvailable: editProperty.autoRickshawAvailable || false,
        // Rules and policies
        visitorPolicy: editProperty.visitorPolicy || "",
        curfewTiming: editProperty.curfewTiming || "",
        guestPolicy: editProperty.guestPolicy || "",
        // Payment terms
        advancePayment: editProperty.advancePayment || "",
        monthlyPayment: editProperty.monthlyPayment || "",
        lateFeePolicy: editProperty.lateFeePolicy || "",
        // Additional details
        description: editProperty.description || "",
        community: editProperty.community || "",
        rules: editProperty.rules || "",
        // Indian-specific utilities
        electricityBackup: editProperty.electricityBackup || false,
        waterSupply: editProperty.waterSupply || "",
        maintenance: editProperty.maintenance || "",
        // Additional amenities
        parkingAvailable: editProperty.parkingAvailable || false,
        liftAvailable: editProperty.liftAvailable || false,
        powerBackup: editProperty.powerBackup || false,
      });
      
      if (editProperty.roomImages && editProperty.roomImages.length > 0) {
        setExistingImages(editProperty.roomImages);
      }
      
      // Set cities for the selected state
      if (editProperty.state) {
        setSelectedState(editProperty.state);
        const citiesList = City.getCitiesOfState("IN", editProperty.state);
        setCities(citiesList);
      }
    }
  }, [editProperty]);

  const handleStateChange = (e) => {
    const stateCode = e.target.value;
    setSelectedState(stateCode);
    const citiesList = City.getCitiesOfState("IN", stateCode);
    setCities(citiesList);
  };

  // Helper function to handle checkbox changes
  const handleCheckboxChange = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // Helper function to handle furniture selection
  const handleFurnitureChange = (furnitureItem) => {
    setFormData(prev => ({
      ...prev,
      furniture: prev.furniture.includes(furnitureItem)
        ? prev.furniture.filter(item => item !== furnitureItem)
        : [...prev.furniture, furnitureItem]
    }));
  };

  // Step navigation functions
  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step) => {
    setCurrentStep(step);
  };

  // Step validation - only check required fields (marked with *)
  const validateStep = (step) => {
    switch (step) {
      case 1:
        // Required fields: Property Type, Address, State, City, Postal Code
        return formData.properttyType && formData.address && formData.state && formData.city && formData.postalCode;
      case 2:
        // Required fields: Monthly Rent, Security Deposit, Availability Month, Day, Nearest College
        return formData.rent && formData.deposit && formData.availabilityMonth && formData.availabilityDay && formData.heading;
      case 3:
        // No required fields - all room details are optional
        return true;
      case 4:
        // No required fields - all amenities are optional
        return true;
      case 5:
        // No required fields - all rules and policies are optional
        return true;
      case 6:
        // No required fields - all additional info is optional
        return true;
      default:
        return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = [
      "properttyType",
      "address",
      "state",
      "city",
      "postalCode",
      "phone",
      "email",
      "rent",
      "deposit",
      "availabilityMonth",
      "availabilityDay",
      "heading",
    ];

    for (const field of requiredFields) {
      if (!formData[field]) {
        toast.error(`Please fill the required field: ${field}`);
        return;
      }
    }

    // Require at least one image only when creating a new property,
    // or when editing and there are no existing images.
    if (!editProperty) {
      if (roomImages.length === 0) {
        toast.error("Please upload at least one room image");
        return;
      }
    } else {
      const hasExisting = existingImages && existingImages.length > 0;
      if (!hasExisting && roomImages.length === 0) {
        toast.error("Please upload at least one room image");
        return;
      }
    }

    setIsLoading(true);

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) =>
      formDataToSend.append(key, value)
    );
    roomImages.forEach((image) => {
      formDataToSend.append("roomImages", image);
    });

    try {
      if (editProperty) {
        // Update existing property
        await axios.put(`${backendurl}/api/property/update/${editProperty._id}`, formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        });
        toast.success("Property updated successfully!");
      } else {
        // Create new property
        await axios.post(`${backendurl}/api/property/add`, formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        });
        toast.success("Property added successfully!");
      }
      onBack();
    } catch (error) {
      console.error(error);
      toast.error(editProperty ? "Failed to update property. Please try again." : "Failed to add property. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Step indicator component
  const StepIndicator = () => (
    <div className="mb-6 px-2">
      <div className="flex items-center justify-between overflow-x-auto pb-2">
        {Array.from({ length: totalSteps }, (_, index) => (
          <div key={index + 1} className="flex items-center flex-shrink-0">
            <button
              type="button"
              onClick={() => goToStep(index + 1)}
              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium ${
                currentStep === index + 1
                  ? 'bg-[#3A2C99] text-white'
                  : currentStep > index + 1
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-300 text-gray-600'
              }`}
            >
              {index + 1}
            </button>
            {index < totalSteps - 1 && (
              <div className={`w-8 sm:w-12 md:w-16 h-1 mx-1 sm:mx-2 ${
                currentStep > index + 1 ? 'bg-green-500' : 'bg-gray-300'
              }`} />
            )}
          </div>
        ))}
      </div>
      <div className="mt-2 text-center">
        <span className="text-xs sm:text-sm text-gray-600">
          Step {currentStep} of {totalSteps}
        </span>
      </div>
    </div>
  );

  // Step titles
  const stepTitles = [
    "Basic Information",
    "College & Pricing",
    "Room Details",
    "Amenities & Facilities",
    "Rules & Policies",
    "Additional Information"
  ];

  return (
    <div className="px-2 sm:px-4 md:px-6">
      {propertyType === "single" ? (
        <div className="max-w-4xl mx-auto bg-white p-3 sm:p-6 md:p-8 shadow-md rounded-md">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4 sm:mb-6">
            <RenterInfo text={editProperty ? "Edit Property Listing" : "Add a New Listing"} />
          </h2>
          
          <StepIndicator />
          
          <div className="mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-semibold text-[#3A2C99]">
              {stepTitles[currentStep - 1]}
            </h3>
            {currentStep <= 2 && (
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                <RenterInfo text="Fields marked with * are required" />
              </p>
            )}
            {currentStep > 2 && (
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                <RenterInfo text="All fields on this step are optional" />
              </p>
            )}
          </div>

          <form className="flex flex-col gap-4 sm:gap-6" onSubmit={handleSubmit}>
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-4 sm:space-y-6">
                {/* Property Type */}
                <div>
                  <label className="block font-medium mb-1">
                    <RenterInfo text="Property Type *" />
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-md p-2"
                    value={formData.properttyType}
                    onChange={(e) =>
                      setFormData({ ...formData, properttyType: e.target.value })
                    }
                  >
                    <option value="">None Selected</option>
                    <option value="PG (Paying Guest)">PG (Paying Guest)</option>
                    <option value="Boys Hostel">Boys Hostel</option>
                    <option value="Girls Hostel">Girls Hostel</option>
                    <option value="Mixed Hostel">Mixed Hostel</option>
                    <option value="Single Room">Single Room</option>
                    <option value="Double Sharing">Double Sharing</option>
                    <option value="Triple Sharing">Triple Sharing</option>
                    <option value="Four Sharing">Four Sharing</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Independent House">Independent House</option>
                    <option value="Flat">Flat</option>
                    <option value="Villa">Villa</option>
                  </select>
                </div>

                {/* Address */}
                <div>
                  <label className="block font-medium mb-1">
                    <RenterInfo text="Address *" />
                  </label>
                  <input
                    type="text"
                    placeholder="Enter a location"
                    className="w-full border border-gray-300 rounded-md p-2"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                  />
                </div>

                {/* State */}
                <div>
                  <label className="block font-medium mb-1">
                    <RenterInfo text="State *" />
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-md p-2"
                    onChange={(e) => {
                      handleStateChange(e);
                      setFormData({ ...formData, state: e.target.value });
                    }}
                    value={formData.state}
                  >
                    <option value="">
                      <TranslatedText text="Select State" />
                    </option>
                    {State.getStatesOfCountry("IN").map((state) => (
                      <option key={state.isoCode} value={state.isoCode}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* City */}
                <div>
                  <label className="block font-medium mb-1">
                    <RenterInfo text="City *" />
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-md p-2"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                  >
                    <option value="">
                      <TranslatedText text="Select City" />
                    </option>
                    {cities.map((city) => (
                      <option key={city.name}>{city.name}</option>
                    ))}
                  </select>
                </div>

                {/* Postal Code */}
                <div>
                  <label className="block font-medium mb-1">
                    <RenterInfo text="Postal Code *" />
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md p-2"
                    value={formData.postalCode}
                    onChange={(e) =>
                      setFormData({ ...formData, postalCode: e.target.value })
                    }
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block font-medium mb-1">
                    <RenterInfo text="Phone *" />
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md p-2 bg-gray-100 cursor-not-allowed"
                    placeholder="(XXX) XXX-XXXX"
                    value={formData.phone}
                    readOnly
                    disabled
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block font-medium mb-1">
                    <RenterInfo text="Contact Email *" />
                  </label>
                  <input
                    type="email"
                    className="w-full border border-gray-300 rounded-md p-2 bg-gray-100 cursor-not-allowed"
                    placeholder="example@email.com"
                    value={formData.email}
                    readOnly
                    disabled
                  />
                </div>
              </div>
            )}

            {/* Step 2: College & Pricing */}
            {currentStep === 2 && (
              <div className="space-y-6">

                {/* College Information */}
                <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                  <h4 className="text-sm sm:text-md font-semibold mb-3 text-blue-800">
                    <RenterInfo text="College Information" />
                  </h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block font-medium mb-1">
                        <RenterInfo text="Nearest College/University *" />
                      </label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-md p-2"
                        placeholder="e.g. IIT Delhi, RGUKT Nuzvid, Fergusson College"
                        maxLength={80}
                        value={formData.heading}
                        onChange={(e) =>
                          setFormData({ ...formData, heading: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <label className="block font-medium mb-1">
                        <RenterInfo text="Distance from College (km)" />
                      </label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-md p-2"
                        placeholder="e.g. 2.5 km, 15 min walk"
                        value={formData.distanceFromCollege}
                        onChange={(e) =>
                          setFormData({ ...formData, distanceFromCollege: e.target.value })
                        }
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-medium mb-1">
                        <RenterInfo text="Preferred Courses/Streams" />
                      </label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-md p-2 text-sm sm:text-base"
                        placeholder="e.g. Engineering, Medical, Arts, Commerce, Science"
                        value={formData.coursePreferences}
                        onChange={(e) =>
                          setFormData({ ...formData, coursePreferences: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Pricing Information */}
                <div className="bg-green-50 p-3 sm:p-4 rounded-lg">
                  <h4 className="text-sm sm:text-md font-semibold mb-3 text-green-800">
                    <RenterInfo text="Pricing & Availability" />
                  </h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block font-medium mb-1">
                        <RenterInfo text="Monthly Rent *" />
                      </label>
                      <div className="w-full border border-gray-300 rounded-md p-2 flex items-center gap-2">
                        <span className="text-gray-600">₹</span>
                        <input
                          type="text"
                          className="w-full outline-none"
                          placeholder="e.g. 6500 per bed"
                          value={formData.rent}
                          onChange={(e) =>
                            setFormData({ ...formData, rent: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-medium mb-1">
                        <RenterInfo text="Security Deposit *" />
                      </label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-md p-2"
                        placeholder="e.g. 1 month rent / 5000"
                        value={formData.deposit}
                        onChange={(e) =>
                          setFormData({ ...formData, deposit: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <label className="block font-medium mb-1">
                        <RenterInfo text="Availability Month *" />
                      </label>
                      <select
                        className="w-full border border-gray-300 rounded-md p-2"
                        value={formData.availabilityMonth}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            availabilityMonth: e.target.value,
                          })
                        }
                      >
                        <option value="">
                          <TranslatedText text="Select Month" />
                        </option>
                        {[
                          "January","February","March","April","May","June",
                          "July","August","September","October","November","December"
                        ].map((m) => (
                          <option key={m}>{m}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-medium mb-1">
                        <RenterInfo text="Day *" />
                      </label>
                      <select
                        className="w-full border border-gray-300 rounded-md p-2"
                        value={formData.availabilityDay}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            availabilityDay: e.target.value,
                          })
                        }
                      >
                        {[...Array(31)].map((_, i) => (
                          <option key={i}>{i + 1}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Room Details */}
            {currentStep === 3 && (
              <div className="space-y-4 sm:space-y-6">

                {/* Room Details */}
                <div className="bg-green-50 p-3 sm:p-4 rounded-lg">
                  <h4 className="text-sm sm:text-md font-semibold mb-3 text-green-800">
                    <RenterInfo text="Room & Facility Details" />
                  </h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block font-medium mb-1">
                        <RenterInfo text="Room Size" />
                      </label>
                      <select
                        className="w-full border border-gray-300 rounded-md p-2"
                        value={formData.roomSize}
                        onChange={(e) =>
                          setFormData({ ...formData, roomSize: e.target.value })
                        }
                      >
                        <option value="">Select Room Size</option>
                        <option value="Small (8x10 ft)">Small (8x10 ft)</option>
                        <option value="Medium (10x12 ft)">Medium (10x12 ft)</option>
                        <option value="Large (12x14 ft)">Large (12x14 ft)</option>
                        <option value="Extra Large (14x16 ft)">Extra Large (14x16 ft)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-medium mb-1">
                        <RenterInfo text="Furniture Available" />
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {['Bed', 'Study Table', 'Chair', 'Wardrobe', 'Bookshelf', 'Dressing Table'].map(item => (
                          <label key={item} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={formData.furniture.includes(item)}
                              onChange={() => handleFurnitureChange(item)}
                              className="mr-2"
                            />
                            <span className="text-xs sm:text-sm">{item}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block font-medium mb-2">
                      <RenterInfo text="Room Amenities" />
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                      {[
                        { key: 'acAvailable', label: 'AC Available' },
                        { key: 'fanAvailable', label: 'Fan Available' },
                        { key: 'attachedBathroom', label: 'Attached Bathroom' },
                        { key: 'balcony', label: 'Balcony' }
                      ].map(amenity => (
                        <label key={amenity.key} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData[amenity.key]}
                            onChange={() => handleCheckboxChange(amenity.key)}
                            className="mr-2"
                          />
                          <span className="text-xs sm:text-sm">{amenity.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Amenities & Facilities */}
            {currentStep === 4 && (
              <div className="space-y-4 sm:space-y-6">

                {/* Hostel Amenities */}
                <div className="bg-purple-50 p-3 sm:p-4 rounded-lg">
                  <h4 className="text-sm sm:text-md font-semibold mb-3 text-purple-800">
                    <RenterInfo text="Hostel Amenities" />
                  </h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                    {[
                      { key: 'wifiAvailable', label: 'WiFi Available' },
                      { key: 'laundryService', label: 'Laundry Service' },
                      { key: 'messAvailable', label: 'Mess Available' },
                      { key: 'commonRoom', label: 'Common Room' },
                      { key: 'studyRoom', label: 'Study Room' },
                      { key: 'gymAvailable', label: 'Gym Available' }
                    ].map(amenity => (
                      <label key={amenity.key} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData[amenity.key]}
                          onChange={() => handleCheckboxChange(amenity.key)}
                          className="mr-2"
                        />
                        <span className="text-xs sm:text-sm">{amenity.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Food Options */}
                <div className="bg-orange-50 p-3 sm:p-4 rounded-lg">
                  <h4 className="text-sm sm:text-md font-semibold mb-3 text-orange-800">
                    <RenterInfo text="Food & Dining Options" />
                  </h4>
                  
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.kitchenAccess}
                        onChange={() => handleCheckboxChange('kitchenAccess')}
                        className="mr-2"
                      />
                      <span className="text-xs sm:text-sm">Kitchen Access Available</span>
                    </div>
                    
                    <div>
                      <label className="block font-medium mb-1">
                        <RenterInfo text="Nearby Restaurants/Food Options" />
                      </label>
                      <textarea
                        className="w-full border border-gray-300 rounded-md p-2"
                        rows="3"
                        placeholder="e.g. Local dhaba, Pizza corner, South Indian restaurant, Street food vendors"
                        value={formData.nearbyRestaurants}
                        onChange={(e) =>
                          setFormData({ ...formData, nearbyRestaurants: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Safety & Security */}
                <div className="bg-red-50 p-3 sm:p-4 rounded-lg">
                  <h4 className="text-sm sm:text-md font-semibold mb-3 text-red-800">
                    <RenterInfo text="Safety & Security" />
                  </h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.cctvAvailable}
                        onChange={() => handleCheckboxChange('cctvAvailable')}
                        className="mr-2"
                      />
                      <span className="text-xs sm:text-sm">CCTV Surveillance</span>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.securityGuard}
                        onChange={() => handleCheckboxChange('securityGuard')}
                        className="mr-2"
                      />
                      <span className="text-xs sm:text-sm">24/7 Security Guard</span>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.femaleOnly}
                        onChange={() => handleCheckboxChange('femaleOnly')}
                        className="mr-2"
                      />
                      <span className="text-xs sm:text-sm">Female Only Property</span>
                    </div>
                  </div>
                </div>

                {/* Transportation */}
                <div className="bg-yellow-50 p-3 sm:p-4 rounded-lg">
                  <h4 className="text-sm sm:text-md font-semibold mb-3 text-yellow-800">
                    <RenterInfo text="Transportation & Connectivity" />
                  </h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block font-medium mb-1">
                        <RenterInfo text="Distance to Bus Stop" />
                      </label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-md p-2"
                        placeholder="e.g. 200m, 5 min walk"
                        value={formData.busStopDistance}
                        onChange={(e) =>
                          setFormData({ ...formData, busStopDistance: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <label className="block font-medium mb-1">
                        <RenterInfo text="Distance to Metro Station" />
                      </label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-md p-2"
                        placeholder="e.g. 1.2 km, 15 min walk"
                        value={formData.metroStationDistance}
                        onChange={(e) =>
                          setFormData({ ...formData, metroStationDistance: e.target.value })
                        }
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.autoRickshawAvailable}
                          onChange={() => handleCheckboxChange('autoRickshawAvailable')}
                          className="mr-2"
                        />
                        <span className="text-xs sm:text-sm">Auto Rickshaw/Taxi easily available nearby</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Utilities & Additional Amenities */}
                <div className="bg-amber-50 p-3 sm:p-4 rounded-lg">
                  <h4 className="text-sm sm:text-md font-semibold mb-3 text-amber-800">
                    <RenterInfo text="Utilities & Additional Amenities" />
                  </h4>
                  
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <label className="block font-medium mb-2">
                        <RenterInfo text="Power & Water Supply" />
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.electricityBackup}
                            onChange={() => handleCheckboxChange('electricityBackup')}
                            className="mr-2"
                          />
                          <span className="text-xs sm:text-sm">Electricity Backup (Inverter/Generator)</span>
                        </div>
                        
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.powerBackup}
                            onChange={() => handleCheckboxChange('powerBackup')}
                            className="mr-2"
                          />
                          <span className="text-xs sm:text-sm">24/7 Power Backup</span>
                        </div>
                      </div>
                      
                      <div className="mt-2">
                        <label className="block font-medium mb-1">
                          <RenterInfo text="Water Supply Details" />
                        </label>
                        <input
                          type="text"
                          className="w-full border border-gray-300 rounded-md p-2"
                          placeholder="e.g. 24/7 water supply, Morning & Evening, Borewell + Corporation water"
                          value={formData.waterSupply}
                          onChange={(e) =>
                            setFormData({ ...formData, waterSupply: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-medium mb-2">
                        <RenterInfo text="Additional Facilities" />
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.parkingAvailable}
                            onChange={() => handleCheckboxChange('parkingAvailable')}
                            className="mr-2"
                          />
                          <span className="text-xs sm:text-sm">Parking Available</span>
                        </div>
                        
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.liftAvailable}
                            onChange={() => handleCheckboxChange('liftAvailable')}
                            className="mr-2"
                          />
                          <span className="text-xs sm:text-sm">Lift Available</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block font-medium mb-1">
                        <RenterInfo text="Maintenance & Services" />
                      </label>
                      <textarea
                        className="w-full border border-gray-300 rounded-md p-2"
                        rows="2"
                        placeholder="e.g. Housekeeping included, Room cleaning service, Maintenance staff available"
                        value={formData.maintenance}
                        onChange={(e) =>
                          setFormData({ ...formData, maintenance: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Rules & Policies */}
            {currentStep === 5 && (
              <div className="space-y-4 sm:space-y-6">

                {/* Rules & Policies */}
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                  <h4 className="text-sm sm:text-md font-semibold mb-3 text-gray-800">
                    <RenterInfo text="Rules & Policies" />
                  </h4>
                  
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <label className="block font-medium mb-1">
                        <RenterInfo text="Visitor Policy" />
                      </label>
                      <textarea
                        className="w-full border border-gray-300 rounded-md p-2"
                        rows="2"
                        placeholder="e.g. Visitors allowed till 10 PM, ID required, No overnight guests"
                        value={formData.visitorPolicy}
                        onChange={(e) =>
                          setFormData({ ...formData, visitorPolicy: e.target.value })
                        }
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="block font-medium mb-1">
                          <RenterInfo text="Curfew Timing" />
                        </label>
                        <input
                          type="text"
                          className="w-full border border-gray-300 rounded-md p-2"
                          placeholder="e.g. 10 PM, 11 PM, No curfew"
                          value={formData.curfewTiming}
                          onChange={(e) =>
                            setFormData({ ...formData, curfewTiming: e.target.value })
                          }
                        />
                      </div>

                      <div>
                        <label className="block font-medium mb-1">
                          <RenterInfo text="Guest Policy" />
                        </label>
                        <input
                          type="text"
                          className="w-full border border-gray-300 rounded-md p-2"
                          placeholder="e.g. No overnight guests, Prior permission required"
                          value={formData.guestPolicy}
                          onChange={(e) =>
                            setFormData({ ...formData, guestPolicy: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Terms */}
                <div className="bg-indigo-50 p-3 sm:p-4 rounded-lg">
                  <h4 className="text-sm sm:text-md font-semibold mb-3 text-indigo-800">
                    <RenterInfo text="Payment Terms" />
                  </h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                    <div>
                      <label className="block font-medium mb-1">
                        <RenterInfo text="Advance Payment" />
                      </label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-md p-2"
                        placeholder="e.g. 1 month rent, 2 months rent"
                        value={formData.advancePayment}
                        onChange={(e) =>
                          setFormData({ ...formData, advancePayment: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <label className="block font-medium mb-1">
                        <RenterInfo text="Monthly Payment Due" />
                      </label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-md p-2"
                        placeholder="e.g. 1st of every month, 5th of every month"
                        value={formData.monthlyPayment}
                        onChange={(e) =>
                          setFormData({ ...formData, monthlyPayment: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <label className="block font-medium mb-1">
                        <RenterInfo text="Late Fee Policy" />
                      </label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-md p-2"
                        placeholder="e.g. ₹100 per day, 5% per month"
                        value={formData.lateFeePolicy}
                        onChange={(e) =>
                          setFormData({ ...formData, lateFeePolicy: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 6: Additional Information */}
            {currentStep === 6 && (
              <div className="space-y-4 sm:space-y-6">

                {/* Additional Details */}
                <div className="bg-teal-50 p-3 sm:p-4 rounded-lg">
                  <h4 className="text-sm sm:text-md font-semibold mb-3 text-teal-800">
                    <RenterInfo text="Additional Information" />
                  </h4>
                  
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <label className="block font-medium mb-1">
                        <RenterInfo text="Property Description" />
                      </label>
                      <textarea
                        className="w-full border border-gray-300 rounded-md p-2"
                        rows="4"
                        placeholder="Describe your property, its unique features, and what makes it special for students..."
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({ ...formData, description: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <label className="block font-medium mb-1">
                        <RenterInfo text="Community/Neighborhood" />
                      </label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-md p-2"
                        placeholder="e.g. Student-friendly area, Near market, Quiet residential area"
                        value={formData.community}
                        onChange={(e) =>
                          setFormData({ ...formData, community: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <label className="block font-medium mb-1">
                        <RenterInfo text="House Rules" />
                      </label>
                      <textarea
                        className="w-full border border-gray-300 rounded-md p-2"
                        rows="3"
                        placeholder="e.g. No smoking, No pets, Keep common areas clean, Respect other tenants"
                        value={formData.rules}
                        onChange={(e) =>
                          setFormData({ ...formData, rules: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Images */}
                <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                  <h4 className="text-sm sm:text-md font-semibold mb-3 text-blue-800">
                    <RenterInfo text="Property Images" />
                  </h4>
                  
                  {/* Existing Images */}
                  {editProperty && existingImages.length > 0 && (
                    <div className="mb-4">
                      <label className="block font-medium mb-2">
                        <RenterInfo text="Current Images" />
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {existingImages.map((img, index) => (
                          <img
                            key={index}
                            src={
                              typeof img === "string"
                                ? img.startsWith("http")
                                  ? img
                                  : `${backendurl}/uploads/${img}`
                                : img?.url
                            }
                            alt={`Room ${index + 1}`}
                            className="w-full h-32 object-cover rounded"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block font-medium mb-1">
                      <RenterInfo text={editProperty ? "Add New Images (Optional)" : "Upload Room Images *"} />
                    </label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="block w-full text-sm text-gray-700 border border-gray-300 rounded-md p-2 cursor-pointer"
                      onChange={(e) => setRoomImages(Array.from(e.target.files))}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t">
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-3 sm:px-4 py-2 text-xs sm:text-sm text-white bg-gray-600 rounded hover:bg-gray-700"
                  >
                    <RenterInfo text="← Previous" />
                  </button>
                )}
                <button
                  onClick={onBack}
                  type="button"
                  className="px-3 sm:px-4 py-2 text-xs sm:text-sm text-white bg-gray-600 rounded hover:bg-gray-700"
                >
                  <RenterInfo text="← Back to List" />
                </button>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-end">
                {/* Validation Status Indicator */}
                {currentStep <= 2 && (
                  <div className="text-xs text-gray-600 mb-2 sm:mb-0">
                    {validateStep(currentStep) ? (
                      <span className="text-green-600 flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                        <RenterInfo text="Ready to proceed" />
                      </span>
                    ) : (
                      <span className="text-red-600 flex items-center">
                        <span className="w-2 h-2 bg-red-500 rounded-full mr-1"></span>
                        <RenterInfo text="Please fill required fields" />
                      </span>
                    )}
                  </div>
                )}
                
                <div className="flex gap-2 sm:gap-4">
                {currentStep < totalSteps ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!validateStep(currentStep)}
                    className={`px-3 sm:px-4 py-2 rounded-md transition text-xs sm:text-sm ${
                      !validateStep(currentStep)
                        ? 'bg-gray-400 cursor-not-allowed text-white opacity-70'
                        : 'text-white bg-[#3A2C99] hover:bg-white hover:text-black cursor-pointer'
                    }`}
                  >
                    <RenterInfo text="Save and Next →" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`px-3 sm:px-4 py-2 rounded-md transition text-xs sm:text-sm ${
                      isLoading 
                        ? 'bg-gray-400 cursor-not-allowed text-white opacity-70' 
                        : 'text-white bg-[#3A2C99] hover:bg-white hover:text-black cursor-pointer'
                    }`}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        <RenterInfo text="Saving..." />
                      </div>
                    ) : (
                      <RenterInfo text={editProperty ? "Update Property" : "Save Property"} />
                    )}
                  </button>
                )}
                </div>
              </div>
            </div>
          </form>
        </div>
      ) : (
        <h2 className="text-xl font-bold mb-4">
          <RenterInfo text="Apartment Listing" />
        </h2>
      )}
    </div>
  );
};

export default PropertyForm;
