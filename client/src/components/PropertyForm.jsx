import { State, City } from "country-state-city";
import { useState } from "react";

const PropertyForm = ({ propertyType, onBack }) => {
const [roomImages, setRoomImages] = useState([]);
    const [selectedState, setSelectedState] = useState("");
  const [cities, setCities] = useState([]);

  const handleStateChange = (e) => {
    const stateCode = e.target.value;
    setSelectedState(stateCode);
    const citiesList = City.getCitiesOfState("IN", stateCode);
    setCities(citiesList);
  };
  return (
    <div>
      {propertyType === "single" ? (
        <div className="max-w-4xl mx-auto bg-white p-8 shadow-md rounded-md">
          <h2 className="text-2xl font-semibold mb-6">Add a New Listing</h2>

          <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Property Type */}
            <div>
              <label className="block font-medium mb-1">Property Type *</label>
              <select className="w-full border border-gray-300 rounded-md p-2">
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
              />
            </div>

              {/* State Dropdown */}
      <div>
        <label className="block font-medium mb-1">State *</label>
        <select
          className="w-full border border-gray-300 rounded-md p-2"
          onChange={handleStateChange}
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
        <select className="w-full border border-gray-300 rounded-md p-2">
          <option value="">Select City</option>
          {cities.map((city) => (
            <option key={city.name}>{city.name}</option>
          ))}
        </select>
      </div>

            {/* Community */}
            <div>
              <label className="block font-medium mb-1">Community *</label>
              <select className="w-full border border-gray-300 rounded-md p-2">
                <option>Select Community</option>
              </select>
            </div>

            {/* Postal Code */}
            <div>
              <label className="block font-medium mb-1">Postal Code *</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            {/* Hide Address */}
            <div className="col-span-2">
              <label className="block font-medium mb-1">Hide Address *</label>
              <div className="flex gap-6 items-center mt-2">
                <label className="flex items-center gap-2">
                  <input type="radio" name="hideAddress" value="no" defaultChecked />
                  No
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="hideAddress" value="yes" />
                  Yes
                </label>
              </div>
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
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Extension</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            {/* Email */}
            <div className="col-span-2">
              <label className="block font-medium mb-1">Contact Email *</label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="example@email.com"
              />
            </div>

            {/* Monthly Rent and Security Deposit */}
<div>
  <label className="block font-medium mb-1">Monthly Rent *</label>
  <input
    type="number"
    className="w-full border border-gray-300 rounded-md p-2"
    placeholder="$"
  />
</div>

<div>
  <label className="block font-medium mb-1">Security Deposit *</label>
  <select className="w-full border border-gray-300 rounded-md p-2">
    <option>1 Month Rent</option>
    <option>Half Month Rent</option>
    <option>Custom</option>
  </select>
</div>

{/* Lease Term */}
<div>
  <label className="block font-medium mb-1">Lease Term *</label>
  <select className="w-full border border-gray-300 rounded-md p-2">
    <option>Long Term</option>
    <option>Short Term</option>
    <option>Month-to-Month</option>
  </select>
</div>

{/* Availability Date */}
<div className="flex gap-4">
  <div>
    <label className="block font-medium mb-1">Availability Month *</label>
    <select className="w-full border border-gray-300 rounded-md p-2">
      <option>Select Month</option>
      <option>August</option>
      <option>September</option>
      {/* Add all months */}
    </select>
  </div>
  <div>
    <label className="block font-medium mb-1">Day *</label>
    <select className="w-full border border-gray-300 rounded-md p-2">
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
  />
</div>

{/* Hidden Notes */}
<div className="col-span-2">
  <label className="block font-medium mb-1">Hidden Notes</label>
  <input
    type="text"
    className="w-full border border-gray-300 rounded-md p-2"
    placeholder="Only visible to you, not to renters"
  />
</div>

{/* Quick Share Info */}
<div className="col-span-2 bg-gray-100 border p-4 rounded-md text-sm text-gray-600">
  Once your property is posted, a permanent link to your listing will be displayed here for quick sharing.
</div>

{/* Full Description */}
<div className="col-span-2">
  <label className="block font-medium mb-1">Full Description</label>
  <textarea
    className="w-full border border-gray-300 rounded-md p-2 h-32"
    placeholder="Please do not put email addresses in this field – it may lead to spam."
  ></textarea>
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


          </form>
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
