import React from "react";

const SingleUnitForm = () => {
  return (
    <div className="max-w-4xl mx-auto bg-white p-8 shadow-md rounded-md">
      <h2 className="text-2xl font-semibold mb-6">Add a New Listing</h2>

      <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Property Type */}
        <div>
          <label className="block font-medium mb-1">Property Type *</label>
          <select className="w-full border border-gray-300 rounded-md p-2">
            <option>None Selected</option>
            <option>Single Unit</option>
            <option>Apartment</option>
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

        {/* Province */}
        <div>
          <label className="block font-medium mb-1">Province *</label>
          <select className="w-full border border-gray-300 rounded-md p-2">
            <option>Alberta</option>
            <option>British Columbia</option>
            {/* add others as needed */}
          </select>
        </div>

        {/* City */}
        <div>
          <label className="block font-medium mb-1">City *</label>
          <select className="w-full border border-gray-300 rounded-md p-2">
            <option>Select City</option>
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
          <div className="flex gap-6 items-center">
            <label><input type="checkbox" defaultChecked /> Phone</label>
            <label><input type="checkbox" defaultChecked /> Text</label>
            <label><input type="checkbox" defaultChecked /> Email</label>
          </div>
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
      </form>
    </div>
  );
};

export default SingleUnitForm;
