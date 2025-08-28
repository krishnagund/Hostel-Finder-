import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import RenterInfo from "../components/RenterInfo";
import TranslatedText from "../components/TranslatedText";

const ListingsTab = ({ properties }) => {
  const { backendurl } = useContext(AppContext);
  const validProperties = Array.isArray(properties) ? properties : [];

  return (
    <div className="px-4 sm:px-6 md:px-10 py-6">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 text-center">
        <RenterInfo text="Your Listings" />
      </h2>

      {validProperties.length === 0 ? (
        <p className="text-center text-gray-600 text-sm sm:text-base">
          <RenterInfo text="No properties found." />
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {validProperties.map((property) => (
            <div
              key={property._id}
              className="bg-white shadow-md rounded-xl p-4 sm:p-6 border hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg sm:text-xl font-semibold text-blue-700 mb-2">
                {property.properttyType ? (
                  <TranslatedText text={property.properttyType} />
                ) : (
                  <RenterInfo text="Room for Rent" />
                )}
              </h3>

              <p className="text-gray-700 mb-1 text-sm sm:text-base">
                <strong>
                  <RenterInfo text="Rent:" />
                </strong>{" "}
                ₹<TranslatedText text={property.rent} />
              </p>

              <p className="text-gray-700 mb-1 text-sm sm:text-base">
                <strong>
                  <RenterInfo text="Deposit:" />
                </strong>{" "}
                <TranslatedText text={property.deposit} />
              </p>

              <p className="text-gray-700 mb-1 text-sm sm:text-base">
                <strong>
                  <RenterInfo text="City:" />
                </strong>{" "}
                <TranslatedText text={property.city} />,{" "}
                <TranslatedText text={property.state} />
              </p>

              <p className="text-gray-700 mb-1 text-sm sm:text-base">
                <strong>
                  <RenterInfo text="Postal Code:" />
                </strong>{" "}
                <TranslatedText text={property.postalCode} />
              </p>

              <p className="text-gray-700 mb-1 text-sm sm:text-base">
                <strong>
                  <RenterInfo text="Availability:" />
                </strong>{" "}
                {property.availabilityDay && property.availabilityMonth ? (
                  <>
                    <TranslatedText text={property.availabilityDay} />{" "}
                    <TranslatedText text={property.availabilityMonth} />
                  </>
                ) : (
                  <RenterInfo text="Not specified" />
                )}
              </p>

              <p className="text-gray-600 text-xs sm:text-sm mt-3">
                <strong>
                  <RenterInfo text="Contact:" />
                </strong>{" "}
                <TranslatedText text={property.phone} /> <br />
                <strong>
                  <RenterInfo text="Email:" />
                </strong>{" "}
                <TranslatedText text={property.email} />
              </p>

              {/* ✅ Room Images */}
              {property.roomImages && property.roomImages.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {property.roomImages.map((img, index) => (
                    <img
                      key={index}
                      src={
                        typeof img === "string"
                          ? img.startsWith("http")
                            ? img // already a full URL
                            : `${backendurl}/uploads/${img}` // backend-hosted file
                          : img?.url // if stored as object
                      }
                      alt={`Room ${index + 1}`}
                      className="w-full h-28 sm:h-32 md:h-36 lg:h-40 object-cover rounded"
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListingsTab;
