import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AppContext } from "../context/Appcontext";
import { toast } from "react-toastify";

const PropertyDetailsModal = ({ property, onClose }) => {
  
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const { backendurl } = useContext(AppContext);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(
    "I came across your listing and would be interested in seeing the place. What are the next steps?"
  );

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [moveInDate, setMoveInDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Track if we pushed a history state for this modal
  const [pushedState, setPushedState] = useState(false);

  useEffect(() => {
    if (!property) return;
    // Push a new history state so Back closes the modal instead of leaving the page
    window.history.pushState({ modalOpen: true }, "");
    setPushedState(true);
    const handlePop = () => {
      // When user presses back, close the modal
      onClose?.();
    };
    window.addEventListener("popstate", handlePop);
    return () => {
      window.removeEventListener("popstate", handlePop);
      // If we pushed a state for the modal and the user closed via the close button,
      // navigate back one step to restore the previous history without leaving the page
      if (pushedState && window.history.state && window.history.state.modalOpen) {
        // Clean up the extra state only if still present
        window.history.back();
      }
    };
  }, [property]);

  const handleCloseClick = () => {
    if (pushedState) {
      // This will trigger popstate and call onClose
      window.history.back();
    } else {
      onClose?.();
    }
  };

  // Don't render if no property
  if (!property) {
    return null;
  }



  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    
    try {
      const res = await axios.post(
        `${backendurl}/api/messages/send`,
        {
          propertyId: property._id,
          name,
          email,
          phone,
          moveInDate,
          message,
        },
        { withCredentials: true }
      );

      if (res?.data?.success) {
        toast.success("Message sent successfully!");
        setName("");
        setEmail("");
        setPhone("");
        setMoveInDate("");
        setMessage("");
        onClose();
        return;
      }

      if (res?.data?.needsAuth) {
        toast.error("Please log in to send a message.");
        return;
      }

      toast.error(res?.data?.message || "Failed to send message");
    } catch (err) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div 
          className="relative bg-white rounded-lg shadow-lg w-[95%] max-w-7xl max-h-screen h-auto sm:h-[90%] p-2 sm:p-4 lg:p-6 overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            className="absolute top-3 right-3 text-2xl font-bold text-gray-700 hover:text-red-500 z-10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleCloseClick}
            disabled={isSubmitting}
          >
            ✕
          </button>

          {/* Layout: Left Images + Right Details */}
          <div className="flex flex-col lg:flex-row h-full gap-3 sm:gap-4 overflow-hidden">
            {/* LEFT: Images */}
            <div className="w-full lg:w-1/2 flex flex-col bg-black rounded overflow-hidden">
              <div className="flex-1 flex items-center justify-center bg-black relative p-2">
                {property.roomImages?.length > 0 ? (
                  <img
                    src={property.roomImages[currentImage]}
                    alt="Property Main"
                    className="max-h-[30vh] sm:max-h-[50vh] lg:max-h-[60vh] w-auto object-contain rounded"
                  />
                ) : (
                  <div className="text-white text-center p-4">
                    <div className="text-4xl mb-2">🏠</div>
                    <div>No Image Available</div>
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {property.roomImages?.length > 1 && (
                <div className="flex flex-wrap gap-1 sm:gap-2 p-2 bg-white justify-center overflow-x-auto">
                  {property.roomImages?.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Thumbnail ${idx}`}
                      className={`cursor-pointer object-cover rounded border-2 h-12 w-12 sm:h-16 sm:w-16 ${
                        idx === currentImage
                          ? "border-[#3A2C99]"
                          : "border-transparent hover:border-gray-300"
                      }`}
                      onClick={() => setCurrentImage(idx)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT: Details + Contact Form */}
            <div className="w-full lg:w-1/2 p-3 sm:p-4 lg:p-6 overflow-y-auto border-t lg:border-t-0 lg:border-l border-gray-200 flex flex-col gap-4 sm:gap-6">
              {/* Basic Property Info */}
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <h2 className="text-lg sm:text-2xl font-bold text-gray-900 mb-2">
                  {property.properttyType}
                </h2>
                <p className="text-base sm:text-xl font-semibold text-green-700 mb-2">
                  ₹{property.rent}
                </p>
                <p className="text-gray-700 mb-1">{property.address}</p>
                <p className="text-gray-600 mb-3">
                  {property.city}, {property.state}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm sm:text-base">
                  <p>
                    <span className="font-semibold">Available from:</span>{" "}
                    {property.availabilityDay} {property.availabilityMonth}
                  </p>
                  <p>
                    <span className="font-semibold">Contact:</span>{" "}
                    {property.phone}
                  </p>
                  {property.deposit && (
                    <p>
                      <span className="font-semibold">Security Deposit:</span>{" "}
                      {property.deposit}
                    </p>
                  )}
                </div>
              </div>

              {/* College Information */}
              {property.heading && (
                <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                  <h3 className="text-base sm:text-lg font-semibold text-blue-800 mb-3">
                    🎓 College Information
                  </h3>
                  <div className="space-y-2 text-sm sm:text-base">
                    <p>
                      <span className="font-semibold">Nearest College:</span>{" "}
                      {property.heading}
                    </p>
                    {property.distanceFromCollege && (
                      <p>
                        <span className="font-semibold">Distance:</span>{" "}
                        {property.distanceFromCollege}
                      </p>
                    )}
                    {property.coursePreferences && (
                      <p>
                        <span className="font-semibold">Preferred Courses:</span>{" "}
                        {property.coursePreferences}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Room Details */}
              {(property.roomSize || property.furniture?.length > 0 || property.acAvailable || property.fanAvailable || property.attachedBathroom || property.balcony) && (
                <div className="bg-green-50 p-3 sm:p-4 rounded-lg">
                  <h3 className="text-base sm:text-lg font-semibold text-green-800 mb-3">
                    🏠 Room Details
                  </h3>
                  <div className="space-y-2 text-sm sm:text-base">
                    {property.roomSize && (
                      <p>
                        <span className="font-semibold">Room Size:</span>{" "}
                        {property.roomSize}
                      </p>
                    )}
                    {property.furniture?.length > 0 && (
                      <div>
                        <span className="font-semibold">Furniture:</span>{" "}
                        <span className="text-gray-700">{property.furniture.join(", ")}</span>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {property.acAvailable && <span className="bg-green-200 text-green-800 px-2 py-1 rounded text-xs">AC Available</span>}
                      {property.fanAvailable && <span className="bg-green-200 text-green-800 px-2 py-1 rounded text-xs">Fan Available</span>}
                      {property.attachedBathroom && <span className="bg-green-200 text-green-800 px-2 py-1 rounded text-xs">Attached Bathroom</span>}
                      {property.balcony && <span className="bg-green-200 text-green-800 px-2 py-1 rounded text-xs">Balcony</span>}
                    </div>
                  </div>
                </div>
              )}

              {/* Amenities */}
              {(property.wifiAvailable || property.laundryService || property.messAvailable || property.commonRoom || property.studyRoom || property.gymAvailable) && (
                <div className="bg-purple-50 p-3 sm:p-4 rounded-lg">
                  <h3 className="text-base sm:text-lg font-semibold text-purple-800 mb-3">
                    ⭐ Amenities
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {property.wifiAvailable && <span className="bg-purple-200 text-purple-800 px-2 py-1 rounded text-xs">WiFi</span>}
                    {property.laundryService && <span className="bg-purple-200 text-purple-800 px-2 py-1 rounded text-xs">Laundry</span>}
                    {property.messAvailable && <span className="bg-purple-200 text-purple-800 px-2 py-1 rounded text-xs">Mess</span>}
                    {property.commonRoom && <span className="bg-purple-200 text-purple-800 px-2 py-1 rounded text-xs">Common Room</span>}
                    {property.studyRoom && <span className="bg-purple-200 text-purple-800 px-2 py-1 rounded text-xs">Study Room</span>}
                    {property.gymAvailable && <span className="bg-purple-200 text-purple-800 px-2 py-1 rounded text-xs">Gym</span>}
                  </div>
                </div>
              )}

              {/* Food Options */}
              {(property.kitchenAccess || property.nearbyRestaurants) && (
                <div className="bg-orange-50 p-3 sm:p-4 rounded-lg">
                  <h3 className="text-base sm:text-lg font-semibold text-orange-800 mb-3">
                    🍽️ Food Options
                  </h3>
                  <div className="space-y-2 text-sm sm:text-base">
                    {property.kitchenAccess && (
                      <p className="flex items-center">
                        <span className="bg-orange-200 text-orange-800 px-2 py-1 rounded text-xs mr-2">Kitchen Access</span>
                      </p>
                    )}
                    {property.nearbyRestaurants && (
                      <p>
                        <span className="font-semibold">Nearby Restaurants:</span>{" "}
                        <span className="text-gray-700">{property.nearbyRestaurants}</span>
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Safety & Security */}
              {(property.cctvAvailable || property.securityGuard || property.femaleOnly) && (
                <div className="bg-red-50 p-3 sm:p-4 rounded-lg">
                  <h3 className="text-base sm:text-lg font-semibold text-red-800 mb-3">
                    🔒 Safety & Security
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {property.cctvAvailable && <span className="bg-red-200 text-red-800 px-2 py-1 rounded text-xs">CCTV</span>}
                    {property.securityGuard && <span className="bg-red-200 text-red-800 px-2 py-1 rounded text-xs">24/7 Security</span>}
                    {property.femaleOnly && <span className="bg-red-200 text-red-800 px-2 py-1 rounded text-xs">Female Only</span>}
                  </div>
                </div>
              )}

              {/* Transportation */}
              {(property.busStopDistance || property.metroStationDistance || property.autoRickshawAvailable) && (
                <div className="bg-yellow-50 p-3 sm:p-4 rounded-lg">
                  <h3 className="text-base sm:text-lg font-semibold text-yellow-800 mb-3">
                    🚌 Transportation
                  </h3>
                  <div className="space-y-2 text-sm sm:text-base">
                    {property.busStopDistance && (
                      <p>
                        <span className="font-semibold">Bus Stop:</span>{" "}
                        {property.busStopDistance}
                      </p>
                    )}
                    {property.metroStationDistance && (
                      <p>
                        <span className="font-semibold">Metro Station:</span>{" "}
                        {property.metroStationDistance}
                      </p>
                    )}
                    {property.autoRickshawAvailable && (
                      <p className="flex items-center">
                        <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded text-xs">Auto/Taxi Available</span>
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Utilities */}
              {(property.electricityBackup || property.powerBackup || property.waterSupply || property.parkingAvailable || property.liftAvailable) && (
                <div className="bg-amber-50 p-3 sm:p-4 rounded-lg">
                  <h3 className="text-base sm:text-lg font-semibold text-amber-800 mb-3">
                    ⚡ Utilities & Facilities
                  </h3>
                  <div className="space-y-2 text-sm sm:text-base">
                    {property.waterSupply && (
                      <p>
                        <span className="font-semibold">Water Supply:</span>{" "}
                        {property.waterSupply}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {property.electricityBackup && <span className="bg-amber-200 text-amber-800 px-2 py-1 rounded text-xs">Electricity Backup</span>}
                      {property.powerBackup && <span className="bg-amber-200 text-amber-800 px-2 py-1 rounded text-xs">24/7 Power</span>}
                      {property.parkingAvailable && <span className="bg-amber-200 text-amber-800 px-2 py-1 rounded text-xs">Parking</span>}
                      {property.liftAvailable && <span className="bg-amber-200 text-amber-800 px-2 py-1 rounded text-xs">Lift</span>}
                    </div>
                  </div>
                </div>
              )}

              {/* Rules & Policies */}
              {(property.visitorPolicy || property.curfewTiming || property.guestPolicy) && (
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">
                    📋 Rules & Policies
                  </h3>
                  <div className="space-y-2 text-sm sm:text-base">
                    {property.visitorPolicy && (
                      <p>
                        <span className="font-semibold">Visitor Policy:</span>{" "}
                        <span className="text-gray-700">{property.visitorPolicy}</span>
                      </p>
                    )}
                    {property.curfewTiming && (
                      <p>
                        <span className="font-semibold">Curfew:</span>{" "}
                        {property.curfewTiming}
                      </p>
                    )}
                    {property.guestPolicy && (
                      <p>
                        <span className="font-semibold">Guest Policy:</span>{" "}
                        <span className="text-gray-700">{property.guestPolicy}</span>
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Payment Terms */}
              {(property.advancePayment || property.monthlyPayment || property.lateFeePolicy) && (
                <div className="bg-indigo-50 p-3 sm:p-4 rounded-lg">
                  <h3 className="text-base sm:text-lg font-semibold text-indigo-800 mb-3">
                    💰 Payment Terms
                  </h3>
                  <div className="space-y-2 text-sm sm:text-base">
                    {property.advancePayment && (
                      <p>
                        <span className="font-semibold">Advance Payment:</span>{" "}
                        {property.advancePayment}
                      </p>
                    )}
                    {property.monthlyPayment && (
                      <p>
                        <span className="font-semibold">Monthly Due:</span>{" "}
                        {property.monthlyPayment}
                      </p>
                    )}
                    {property.lateFeePolicy && (
                      <p>
                        <span className="font-semibold">Late Fee:</span>{" "}
                        {property.lateFeePolicy}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Additional Information */}
              {(property.description || property.community || property.rules || property.maintenance) && (
                <div className="bg-teal-50 p-3 sm:p-4 rounded-lg">
                  <h3 className="text-base sm:text-lg font-semibold text-teal-800 mb-3">
                    📝 Additional Information
                  </h3>
                  <div className="space-y-2 text-sm sm:text-base">
                    {property.description && (
                      <p>
                        <span className="font-semibold">Description:</span>{" "}
                        <span className="text-gray-700">{property.description}</span>
                      </p>
                    )}
                    {property.community && (
                      <p>
                        <span className="font-semibold">Community:</span>{" "}
                        <span className="text-gray-700">{property.community}</span>
                      </p>
                    )}
                    {property.rules && (
                      <p>
                        <span className="font-semibold">House Rules:</span>{" "}
                        <span className="text-gray-700">{property.rules}</span>
                      </p>
                    )}
                    {property.maintenance && (
                      <p>
                        <span className="font-semibold">Maintenance:</span>{" "}
                        <span className="text-gray-700">{property.maintenance}</span>
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="border-t border-gray-300 pt-4">
                <h3 className="text-base sm:text-lg font-semibold mb-3">Contact Landlord</h3>
                <form
                  onSubmit={handleFormSubmit}
                  className="space-y-3 text-sm sm:text-base"
                >
                  <input
                    type="text"
                    placeholder="Name*"
                    className="w-full border p-2 rounded disabled:opacity-50"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                  <input
                    type="email"
                    placeholder="Email Address*"
                    className="w-full border p-2 rounded disabled:opacity-50"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number*"
                    className="w-full border p-2 rounded disabled:opacity-50"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                  <label className="block text-sm font-medium mb-1">Joining Date</label>
                  <input
                    type="date"
                    className="w-full border p-2 rounded disabled:opacity-50"
                    value={moveInDate}
                    onChange={(e) => setMoveInDate(e.target.value)}
                    disabled={isSubmitting}
                  />
                  <label className="block text-sm font-medium mb-1">Messege</label>
                  <textarea
                    rows="3"
                    className="w-full border p-2 rounded disabled:opacity-50"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={isSubmitting}
                  ></textarea>
                  <button
                    type="submit"
                    className="w-full bg-[#3A2C99] text-white py-2 rounded hover:bg-white hover:text-black border border-[#3A2C99] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      "Send Message"
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <button
            className="absolute top-4 right-4 text-white text-3xl cursor-pointer"
            onClick={() => setLightboxOpen(false)}
          >
            ✕
          </button>

          <button
            className="absolute left-4 text-white text-4xl cursor-pointer"
            onClick={() =>
              setCurrentImage((prev) =>
                prev === 0 ? property.roomImages.length - 1 : prev - 1
              )
            }
          >
            ‹
          </button>

          <img
            src={`${backendurl}/uploads/${property.roomImages[currentImage]}`}
            alt="Lightbox"
            className="max-h-[90%] max-w-[90%] object-contain"
          />

          <button
            className="absolute right-4 text-white text-4xl cursor-pointer"
            onClick={() =>
              setCurrentImage((prev) =>
                prev === property.roomImages.length - 1 ? 0 : prev + 1
              )
            }
          >
            ›
          </button>
        </div>
      )}
    </>
  );
};

export default PropertyDetailsModal;
