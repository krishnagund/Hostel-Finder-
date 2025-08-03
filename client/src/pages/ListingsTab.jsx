const ListingsTab = ({ properties }) => {
  const validProperties = Array.isArray(properties) ? properties : [];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Your Listings</h2>
      {validProperties.length === 0 ? (
        <p className="text-center text-gray-600">No properties found.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {validProperties.map((property) => (
            <div
              key={property._id}
              className="bg-white shadow-md rounded-xl p-6 border hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold text-blue-700 mb-2">
                {property.properttyType || "Room for Rent"}
              </h3>
              <p className="text-gray-700 mb-1">
                <strong>Rent:</strong> ₹{property.rent}
              </p>
              <p className="text-gray-700 mb-1">
                <strong>Deposit:</strong> {property.deposit}
              </p>
              <p className="text-gray-700 mb-1">
                <strong>City:</strong> {property.city}, {property.state}
              </p>
              <p className="text-gray-700 mb-1">
                <strong>Postal Code:</strong> {property.postalCode}
              </p>
              <p className="text-gray-700 mb-1">
                <strong>Availability:</strong>{" "}
                {property.availabilityDay && property.availabilityMonth
                  ? `${property.availabilityDay} ${property.availabilityMonth}`
                  : "Not specified"}
              </p>
              <p className="text-gray-600 text-sm mt-3">
                <strong>Contact:</strong> {property.phone} <br />
                <strong>Email:</strong> {property.email}
              </p>
              
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListingsTab;
