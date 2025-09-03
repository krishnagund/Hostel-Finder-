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
          className="relative bg-white rounded-lg shadow-lg w-[95%] max-w-7xl max-h-screen h-auto sm:h-[90%] p-4 sm:p-6 overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            className="absolute top-3 right-3 text-2xl font-bold text-gray-700 hover:text-red-500 z-10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onClose}
            disabled={isSubmitting}
          >
            ✕
          </button>

          {/* Layout: Left Images + Right Details */}
          <div className="flex flex-col lg:flex-row h-full gap-4 overflow-hidden">
            {/* LEFT: Images */}
            <div className="flex-1 flex flex-col bg-black rounded overflow-hidden">
              <div className="flex-1 flex items-center justify-center bg-black relative p-2">
                {property.roomImages?.length > 0 ? (
                  <img
                    src={property.roomImages[currentImage]}
                    alt="Property Main"
                    className="max-h-[40vh] sm:max-h-[60vh] w-auto object-contain rounded"
                  />
                ) : (
                  <div className="text-white">No Image Available</div>
                )}
              </div>

              {/* Thumbnails */}
              <div className="flex flex-wrap gap-2 p-2 bg-white justify-center overflow-x-auto">
                {property.roomImages?.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Thumbnail ${idx}`}
                    className={`cursor-pointer object-cover rounded border-2 h-16 w-16 sm:h-20 sm:w-20 ${
                      idx === currentImage
                        ? "border-[#3A2C99]"
                        : "border-transparent hover:border-gray-300"
                    }`}
                    onClick={() => setCurrentImage(idx)}
                  />
                ))}
              </div>
            </div>

            {/* RIGHT: Details + Contact Form */}
            <div className="w-full lg:w-1/3 p-4 sm:p-6 overflow-y-auto border-t lg:border-t-0 lg:border-l border-gray-200 flex flex-col gap-6">
              <div>
                <h2 className="text-lg sm:text-2xl font-bold text-gray-900 mb-2">
                  {property.properttyType}
                </h2>
                <p className="text-base sm:text-xl font-semibold text-green-700 mb-2">
                  ₹{property.rent}
                </p>
                <p className="text-gray-700 mb-1">{property.address}</p>
                <p className="text-gray-600 mb-4">
                  {property.city}, {property.state}
                </p>

                <div className="space-y-1 text-sm sm:text-base">
                  <p>
                    <span className="font-semibold">Available from:</span>{" "}
                    {property.availabilityDay} {property.availabilityMonth}
                  </p>
                  <p>
                    <span className="font-semibold">Contact:</span>{" "}
                    {property.phone}
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-300 pt-4">
                <h3 className="text-lg font-semibold mb-3">Contact Landlord</h3>
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
                  <input
                    type="date"
                    className="w-full border p-2 rounded disabled:opacity-50"
                    value={moveInDate}
                    onChange={(e) => setMoveInDate(e.target.value)}
                    disabled={isSubmitting}
                  />
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
