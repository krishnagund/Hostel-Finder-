import { State, City } from "country-state-city";
import { useState, useContext } from "react";
import { AppContext } from "../context/Appcontext";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import RenterInfo from "./RenterInfo";
import TranslatedText from "./TranslatedText";

const PropertyForm = ({ propertyType, onBack }) => {
  const navigate = useNavigate();
  const { backendurl } = useContext(AppContext);
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

    if (roomImages.length === 0) {
      toast.error("Please upload at least one room image");
      return;
    }

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) =>
      formDataToSend.append(key, value)
    );
    roomImages.forEach((image) => {
      formDataToSend.append("roomImages", image);
    });

    try {
      await axios.post(`${backendurl}/api/property/add`, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      toast.success("Property added!");
      onBack();
    } catch (error) {
      console.error(error);
      toast.error("Failed to add property");
    }
  };

  return (
    <div className="px-4 sm:px-6">
      {propertyType === "single" ? (
        <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 shadow-md rounded-md">
          <h2 className="text-xl sm:text-2xl font-semibold mb-6">
            <RenterInfo text="Add a New Listing" />
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
                <option>
                  <TranslatedText text="None Selected" />
                </option>
                <option>
                  <TranslatedText text="Single Unit" />
                </option>
                <option>
                  <TranslatedText text="Room for Rent" />
                </option>
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
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="(XXX) XXX-XXXX"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>

            {/* Email */}
            <div>
              <label className="block font-medium mb-1">
                <RenterInfo text="Contact Email *" />
              </label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="example@email.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            {/* Rent */}
            <div>
              <label className="block font-medium mb-1">
                <RenterInfo text="Monthly Rent *" />
              </label>
              <input
                type="number"
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="Rs"
                value={formData.rent}
                onChange={(e) =>
                  setFormData({ ...formData, rent: e.target.value })
                }
              />
            </div>

            {/* Deposit */}
            <div>
              <label className="block font-medium mb-1">
                <RenterInfo text="Security Deposit *" />
              </label>
              <select
                className="w-full border border-gray-300 rounded-md p-2"
                value={formData.deposit}
                onChange={(e) =>
                  setFormData({ ...formData, deposit: e.target.value })
                }
              >
                <option>
                  <TranslatedText text="1 Month Rent" />
                </option>
                <option>
                  <TranslatedText text="Half Month Rent" />
                </option>
                <option>
                  <TranslatedText text="Custom" />
                </option>
              </select>
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
                <RenterInfo text="Property Heading *" />
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="e.g. Cozy 1 Bedroom Downtown Condo"
                maxLength={80}
                value={formData.heading}
                onChange={(e) =>
                  setFormData({ ...formData, heading: e.target.value })
                }
              />
            </div>

            {/* Images */}
            <div>
              <label className="block font-medium mb-1">
                <RenterInfo text="Upload Room Images *" />
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
                className="w-full sm:w-auto text-white bg-[#3A2C99] px-4 py-2 rounded-md hover:bg-white hover:text-black transition cursor-pointer"
              >
                <RenterInfo text="Save and Proceed" />
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
