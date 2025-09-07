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
  });
  const [roomImages, setRoomImages] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [existingImages, setExistingImages] = useState([]);

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

  return (
    <div className="px-4 sm:px-6">
      {propertyType === "single" ? (
        <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 shadow-md rounded-md">
          <h2 className="text-xl sm:text-2xl font-semibold mb-6">
            <RenterInfo text={editProperty ? "Edit Property Listing" : "Add a New Listing"} />
          </h2>

          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
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
                <option value="Single Unit">Single Unit</option>
                <option value="Room for Rent">Room for Rent</option>
                <option value="Single Sharing">Single Sharing</option>
                <option value="Double Sharing">Double Sharing</option>
                <option value="Triple Sharing">Triple Sharing</option>
                <option value="Four Sharing">Four Sharing</option>
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

            {/* Rent */}
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

            {/* Deposit */}
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

            {/* Availability */}
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

            {/* Heading */}
            <div>
              <label className="block font-medium mb-1">
                <RenterInfo text="Nearest College *" />
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

            {/* Existing Images */}
            {editProperty && existingImages.length > 0 && (
              <div>
                <label className="block font-medium mb-1">
                  <RenterInfo text="Current Images" />
                </label>
                <div className="grid grid-cols-2 gap-2 mb-4">
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

            {/* Images */}
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

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full sm:w-auto px-4 py-2 rounded-md transition ${
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
                  <RenterInfo text={editProperty ? "Update Property" : "Save and Proceed"} />
                )}
              </button>
              <button
                onClick={onBack}
                type="button"
                className="w-full sm:w-auto px-4 py-2 text-sm text-white bg-gray-600 rounded hover:bg-gray-700"
              >
                <RenterInfo text="← Back" />
              </button>
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
