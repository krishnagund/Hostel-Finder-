import RenterInfo from "./RenterInfo";
import TranslatedText from "./TranslatedText";

const PropertyTypeSelection = ({ setSelectedPropertyType, onBack }) => {
  return (
    <div className="max-w-4xl mx-auto mt-6 sm:mt-10 p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">
        <RenterInfo text="Add a New Listing" />
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Single Unit Option */}
        <button
          onClick={() => setSelectedPropertyType("single")}
          className="flex flex-col items-center p-6 sm:p-8 md:p-12 w-full min-h-[260px] sm:min-h-[300px] border border-gray-300 rounded-lg shadow-md hover:shadow-xl hover:border-teal-500 transition cursor-pointer"
        >
          <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">🏠</div>
          <h3 className="text-base sm:text-lg font-bold mb-1 sm:mb-2">
            Single Unit
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 text-center">
            <RenterInfo text="House, Duplex, Basement, Condo Unit, Rooms for Rent, etc." />
          </p>
        </button>

        {/* Apartment Option */}
        <button
          onClick={() => setSelectedPropertyType("apartment")}
          className="flex flex-col items-center p-6 sm:p-8 md:p-12 w-full min-h-[260px] sm:min-h-[300px] border border-gray-300 rounded-lg shadow-md hover:shadow-xl hover:border-teal-500 transition cursor-pointer"
        >
          <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">🏢</div>
          <h3 className="text-base sm:text-lg font-bold mb-1 sm:mb-2">
            Apartment
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 text-center">
            <RenterInfo text="For Apartment Buildings and other properties with 3+ units at a single address." />
          </p>
        </button>
      </div>

      <button
        onClick={onBack}
        className="mt-4 sm:mt-6 inline-block text-xs sm:text-sm text-gray-600 hover:text-gray-800"
      >
        <RenterInfo text="← Back" />
      </button>
    </div>
  );
};

export default PropertyTypeSelection;
