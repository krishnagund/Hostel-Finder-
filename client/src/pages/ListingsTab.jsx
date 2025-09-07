import { useContext, useState } from "react";
import { AppContext } from "../context/Appcontext";
import RenterInfo from "../components/RenterInfo";
import TranslatedText from "../components/TranslatedText";
import { toast } from "react-toastify";
import axios from "axios";
import { CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react";

const ListingsTab = ({ properties, onPropertyUpdate, onEditProperty }) => {
  const { backendurl } = useContext(AppContext);
  const validProperties = Array.isArray(properties) ? properties : [];
  const [loadingStates, setLoadingStates] = useState({});

  const handleToggleAvailability = async (propertyId, currentStatus) => {
    setLoadingStates(prev => ({ ...prev, [propertyId]: true }));
    
    try {
      const response = await axios.patch(
        `${backendurl}/api/property/toggle-availability/${propertyId}`,
        {},
        { withCredentials: true }
      );
      
      if (response.data.success) {
        toast.success(response.data.message);
        onPropertyUpdate(); // Refresh properties list
      }
    } catch (error) {
      console.error("Error toggling availability:", error);
      toast.error("Failed to update availability");
    } finally {
      setLoadingStates(prev => ({ ...prev, [propertyId]: false }));
    }
  };

  const handleDeleteProperty = async (propertyId, propertyHeading) => {
    if (!window.confirm(`Are you sure you want to delete "${propertyHeading}"? This action cannot be undone.`)) {
      return;
    }

    setLoadingStates(prev => ({ ...prev, [propertyId]: true }));
    
    try {
      const response = await axios.delete(
        `${backendurl}/api/property/delete/${propertyId}`,
        { withCredentials: true }
      );
      
      if (response.data.success) {
        toast.success("Property deleted successfully");
        onPropertyUpdate(); // Refresh properties list
      }
    } catch (error) {
      console.error("Error deleting property:", error);
      toast.error("Failed to delete property");
    } finally {
      setLoadingStates(prev => ({ ...prev, [propertyId]: false }));
    }
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case 'approved':
        return {
          icon: <CheckCircle size={16} />,
          text: 'Approved',
          color: 'bg-green-100 text-green-800',
          description: 'Your property is live and visible to students'
        };
      case 'pending':
        return {
          icon: <Clock size={16} />,
          text: 'Pending Review',
          color: 'bg-yellow-100 text-yellow-800',
          description: 'Your property is under admin review'
        };
      case 'rejected':
        return {
          icon: <XCircle size={16} />,
          text: 'Rejected',
          color: 'bg-red-100 text-red-800',
          description: 'Your property needs attention'
        };
      default:
        return {
          icon: <AlertCircle size={16} />,
          text: 'Unknown',
          color: 'bg-gray-100 text-gray-800',
          description: 'Status unknown'
        };
    }
  };

  return (
    <div className="px-4 sm:px-6 md:px-10 py-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
          <RenterInfo text="Your Listings" />
        </h2>
        <div className="text-sm text-gray-600">
          {validProperties.length} {validProperties.length === 1 ? 'property' : 'properties'}
        </div>
      </div>

      {validProperties.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🏠</div>
          <p className="text-gray-600 text-lg mb-2">
            <RenterInfo text="No properties found" />
          </p>
          <p className="text-gray-500 text-sm">
            <RenterInfo text="Start by adding your first property listing" />
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {validProperties.map((property) => {
            const statusInfo = getStatusInfo(property.status);
            
            return (
              <div
                key={property._id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group"
              >
                {/* Property Images */}
                <div className="relative">
                  {property.roomImages && property.roomImages.length > 0 && (
                    <img
                      src={
                        typeof property.roomImages[0] === "string"
                          ? property.roomImages[0].startsWith("http")
                            ? property.roomImages[0]
                            : `${backendurl}/uploads/${property.roomImages[0]}`
                          : property.roomImages[0]?.url
                      }
                      alt="Property"
                      className="w-full h-48 object-cover"
                    />
                  )}
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 right-3 flex flex-col gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${statusInfo.color}`}>
                      {statusInfo.icon}
                      {statusInfo.text}
                    </span>
                    
                    {property.isAvailable !== false && property.status === 'approved' && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500 text-white">
                        Available
                      </span>
                    )}
                  </div>
                </div>

                {/* Property Details */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold text-gray-800 line-clamp-1">
                      {property.heading || (
                        property.properttyType ? (
                          <TranslatedText text={property.properttyType} />
                        ) : (
                          <RenterInfo text="Room for Rent" />
                        )
                      )}
                    </h3>
                  </div>

                  {/* Status Description */}
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      {statusInfo.icon}
                      <span>{statusInfo.description}</span>
                    </div>
                    {property.rejectionReason && (
                      <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                        <strong>Rejection Reason:</strong> {property.rejectionReason}
                      </div>
                    )}
                  </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">
                      <RenterInfo text="Rent" />
                    </span>
                    <span className="font-semibold text-lg text-[#3A2C99]">
                      ₹{property.rent?.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">
                      <RenterInfo text="Deposit" />
                    </span>
                    <span className="font-medium text-gray-800">
                      <TranslatedText text={property.deposit} />
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">
                      <RenterInfo text="Location" />
                    </span>
                    <span className="font-medium text-gray-800 text-right">
                      {property.city}, {property.state}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">
                      <RenterInfo text="Available" />
                    </span>
                    <span className="font-medium text-gray-800">
                      {property.availabilityDay && property.availabilityMonth ? (
                        `${property.availabilityDay} ${property.availabilityMonth}`
                      ) : (
                        <RenterInfo text="Not specified" />
                      )}
                    </span>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <div className="text-xs text-gray-600 mb-1">
                    <RenterInfo text="Contact Information" />
                  </div>
                  <div className="text-sm text-gray-800">
                    <div className="flex items-center mb-1">
                      <span className="text-gray-500 mr-2">📞</span>
                      {property.phone}
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-500 mr-2">✉️</span>
                      <span className="truncate">{property.email}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {property.status === 'approved' && (
                    <button
                      onClick={() => handleToggleAvailability(property._id, property.isAvailable)}
                      disabled={loadingStates[property._id]}
                      className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        property.isAvailable !== false
                          ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      } ${loadingStates[property._id] ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {loadingStates[property._id] ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                          <RenterInfo text="Updating..." />
                        </div>
                      ) : (
                        <>
                          {property.isAvailable !== false ? (
                            <RenterInfo text="Mark Unavailable" />
                          ) : (
                            <RenterInfo text="Mark Available" />
                          )}
                        </>
                      )}
                    </button>
                  )}

                  <button
                    onClick={() => onEditProperty && onEditProperty(property)}
                    className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
                  >
                    <RenterInfo text="Edit" />
                  </button>

                  <button
                    onClick={() => handleDeleteProperty(property._id, property.heading)}
                    disabled={loadingStates[property._id]}
                    className="flex-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <RenterInfo text="Delete" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        </div>
      )}
    </div>
  );
};

export default ListingsTab;
