import { State, City } from "country-state-city";
import { useState,useContext } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const PropertyForm = ({ propertyType, onBack }) => {
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
    leaseTerm: "",
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

  if (!userData) {
    toast.error("User not logged in");
    return;
  }

  try {
    const propertyData = {
      ...formData,
      user: userData._id,
      roomImages, // make sure roomImages is defined properly in your component
    };

   const response = await axios.post(
  `${backendurl}/api/property/add`, 
  propertyData,
  { withCredentials: true }
);

  if (response.data.success) {
  toast.success("Property added successfully!");
  onBack(); 
}
else
   {
      toast.error("Failed to add property");
    }
  } catch (error) {
    console.error(error);
    toast.error("An error occurred while adding property");
  }
};



  return (
    <div>
      {propertyType === "single" ? (
        <div className="max-w-4xl mx-auto bg-white p-8 shadow-md rounded-md">
          <h2 className="text-2xl font-semibold mb-6">Add a New Listing</h2>

          <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
            {/* Property Type */}
            <div>
              <label className="block font-medium mb-1">Property Type *</label>
              <select className="w-full border border-gray-300 rounded-md p-2"
                 value={formData.properttyType}
                  onChange={(e) =>
                 setFormData({ ...formData, properttyType: e.target.value })
                  }>
                <option>None Selected</option>
                <option>Single Unit</option>
                <option>Room for rent</option>
              </select>
            </div>

            {/* Address */}
            <div>
              <label className="block font-medium mb-1">Address *</label>
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

              {/* State Dropdown */}
<div>
  <label className="block font-medium mb-1">State *</label>
  <select
    className="w-full border border-gray-300 rounded-md p-2"
    onChange={(e) => {
      handleStateChange(e);
      setFormData({ ...formData, state: e.target.value });
    }}
    value={formData.state}
  >
    <option value="">Select State</option>
    {State.getStatesOfCountry("IN").map((state) => (
      <option key={state.isoCode} value={state.isoCode}>
        {state.name}
      </option>
    ))}
  </select>
</div>

      {/* City Dropdown */}
      <div>
  <label className="block font-medium mb-1">City *</label>
  <select
    className="w-full border border-gray-300 rounded-md p-2"
    value={formData.city}
    onChange={(e) =>
      setFormData({ ...formData, city: e.target.value })
    }
  >
    <option value="">Select City</option>
    {cities.map((city) => (
      <option key={city.name}>{city.name}</option>
    ))}
  </select>
</div>


            {/* Postal Code */}
           <div>
  <label className="block font-medium mb-1">Postal Code *</label>
  <input
    type="text"
    className="w-full border border-gray-300 rounded-md p-2"
    value={formData.postalCode}
    onChange={(e) =>
      setFormData({ ...formData, postalCode: e.target.value })
    }
  />
</div>

            {/* Contact Methods */}
            <div className="col-span-2">
              <label className="block font-medium mb-2">Select Contact Method *</label>
              
            </div>

            {/* Phone */}
            <div>
  <label className="block font-medium mb-1">Phone 1 *</label>
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
            <div className="col-span-2">
  <label className="block font-medium mb-1">Contact Email *</label>
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


            {/* Monthly Rent and Security Deposit */}
<div>
  <label className="block font-medium mb-1">Monthly Rent *</label>
  <input
    type="number"
    className="w-full border border-gray-300 rounded-md p-2"
    placeholder="$"
    value={formData.rent}
    onChange={(e) =>
      setFormData({ ...formData, rent: e.target.value })
    }
  />
</div>

{/* Security Deposit */}
<div>
  <label className="block font-medium mb-1">Security Deposit *</label>
  <select
    className="w-full border border-gray-300 rounded-md p-2"
    value={formData.deposit}
    onChange={(e) =>
      setFormData({ ...formData, deposit: e.target.value })
    }
  >
    <option>1 Month Rent</option>
    <option>Half Month Rent</option>
    <option>Custom</option>
  </select>
</div>


{/* Lease Term */}
<div>
  <label className="block font-medium mb-1">Lease Term *</label>
  <select
    className="w-full border border-gray-300 rounded-md p-2"
    value={formData.leaseTerm}
    onChange={(e) =>
      setFormData({ ...formData, leaseTerm: e.target.value })
    }
  >
    <option>Long Term</option>
    <option>Short Term</option>
    <option>Month-to-Month</option>
  </select>
</div>

{/* Availability Month & Day */}
<div className="flex gap-4">
  <div>
    <label className="block font-medium mb-1">Availability Month *</label>
    <select
      className="w-full border border-gray-300 rounded-md p-2"
      value={formData.availabilityMonth}
      onChange={(e) =>
        setFormData({ ...formData, availabilityMonth: e.target.value })
      }
    >
      <option>Select Month</option>
      <option>August</option>
      <option>September</option>
      {/* Add more months */}
    </select>
  </div>
  <div>
    <label className="block font-medium mb-1">Day *</label>
    <select
      className="w-full border border-gray-300 rounded-md p-2"
      value={formData.availabilityDay}
      onChange={(e) =>
        setFormData({ ...formData, availabilityDay: e.target.value })
      }
    >
      {[...Array(31)].map((_, i) => (
        <option key={i}>{i + 1}</option>
      ))}
    </select>
  </div>
</div>

{/* Property Heading */}
<div className="col-span-2">
  <label className="block font-medium mb-1">Property Heading *</label>
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


{/* Quick Share Info */}
<div className="col-span-2 bg-gray-100 border p-4 rounded-md text-sm text-gray-600">
  Once your property is posted, a permanent link to your listing will be displayed here for quick sharing.
</div>


{/* Upload Multiple Room Images */}
<div className="col-span-2">
  <label className="block font-medium mb-1">Upload Room Images *</label>
  
  <input
    type="file"
    multiple
    accept="image/*"
    className="block w-full text-sm text-gray-700 border border-gray-300 rounded-md p-2 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
    onChange={(e) => {
      const files = Array.from(e.target.files);
      const previews = files.map(file => URL.createObjectURL(file));
      setRoomImages(previews);
    }}
  />
</div>

{roomImages.length > 0 && (
  <div className="col-span-2 mt-4">
    <p className="text-sm text-gray-600 mb-2">Preview:</p>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {roomImages.map((src, idx) => (
        <img
          key={idx}
          src={src}
          alt={`Room Preview ${idx + 1}`}
          className="h-32 w-full object-cover rounded border"
        />
      ))}
    </div>
  </div>
)}

          <div className="col-span-2 flex justify-end gap-4 mt-8">
  <button
    type="button"
    className="text-white bg-[#3A2C99] px-4 py-2 rounded-md hover:bg-white hover:text-black transition cursor-pointer"
  >
    Save Draft
  </button>
  <button
    type="submit"
    className="text-white bg-[#3A2C99] px-4 py-2 rounded-md hover:bg-white hover:text-black transition cursor-pointer"
  >
    Save and Proceed
  </button>
</div>
 </form>
        </div>

        

      ) : (
        <h2 className="text-xl font-bold mb-4">Apartment Listing</h2>
      )}

      <button
        onClick={onBack}
        className="mt-4 px-4 py-2 text-sm text-white bg-gray-600 rounded hover:bg-gray-700"
      >
        ← Back
      </button>
    </div>
  );
};

export default PropertyForm;
