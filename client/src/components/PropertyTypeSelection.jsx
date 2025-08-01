const PropertyTypeSelection = ({ setSelectedPropertyType, onBack }) => {
  return (
    <div className="max-w-4xl mx-auto mt-10 p-6">
      <h2 className="text-2xl font-semibold mb-6">Add a New Listing</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Single Unit Option */}
        <button
          onClick={() => setSelectedPropertyType("single")}
          className="flex flex-col items-center p-12 w-full h-70 border border-gray-300 rounded-lg shadow-lg hover:shadow-xl hover:border-teal-500 transition cursor-pointer"
        >
          <div className="text-5xl mb-4">🏠</div>
          <h3 className="text-lg font-bold mb-2">Single Unit</h3>
          <p className="text-sm text-gray-600 text-center">
            House, Duplex, Basement, Condo Unit, Rooms for Rent, etc.
          </p>
        </button>

        {/* Apartment Option */}
        <button
          onClick={() => setSelectedPropertyType("apartment")}
          className="flex flex-col items-center p-12 w-full h-70 border border-gray-300 rounded-lg shadow-lg hover:shadow-xl hover:border-teal-500 transition cursor-pointer"
        >
          <div className="text-5xl mb-4">🏢</div>
          <h3 className="text-lg font-bold mb-2">Apartment</h3>
          <p className="text-sm text-gray-600 text-center">
            For Apartment Buildings and other properties with 3+ units at a single address.
          </p>
        </button>
      </div>

      <button
        onClick={onBack}
        className="mt-6 inline-block text-sm text-gray-600 hover:text-gray-800"
      >
        ← Back
      </button>
    </div>
  );
};

export default PropertyTypeSelection;
