import React, { useEffect, useState, useContext } from "react";
import api from "../utils/axiosInstance";
import { assets } from "../assets/assets";
import { AppContext } from "../context/Appcontext";
import { Eye, CheckCircle, XCircle, Star, Trash2, Calendar, MapPin, Phone, Mail } from "lucide-react";
import AdminNavbar from "../components/AdminNavbar";

export default function PropertiesPage() {
  const [props, setProps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("pending");
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [notificationCount, setNotificationCount] = useState(0);
  const { backendurl } = useContext(AppContext);

  const load = async () => {
    try {
      const { data } = await api.get(`${backendurl}/api/admin/properties?status=${selectedStatus}`);
      if (data.success) setProps(data.properties);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const loadNotificationCount = async () => {
    try {
      const { data } = await api.get(`${backendurl}/api/admin/notifications/count`);
      if (data.success) setNotificationCount(data.notificationCount);
    } catch (e) {
      console.error(e);
    }
  };

  const markNotificationsSeen = async () => {
    try {
      await api.put(`${backendurl}/api/admin/notifications/mark-seen`);
      setNotificationCount(0);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    load();
    loadNotificationCount();
  }, [selectedStatus]);

  useEffect(() => {
    // Load notification count when component mounts
    loadNotificationCount();
  }, []);

  const action = async (id, type, reason = "") => {
    const actionText = type === "approve" ? "approve" : type === "reject" ? "reject" : "delete";
    if (!window.confirm(`${actionText} this property?`)) return;
    
    try {
      if (type === "reject") {
        await api.put(`${backendurl}/api/admin/properties/${id}/${type}`, { rejectionReason: reason });
      } else {
        await api.put(`${backendurl}/api/admin/properties/${id}/${type}`);
      }
      await load();
      await loadNotificationCount(); // Refresh notification count after action
      setShowModal(false);
      setSelectedProperty(null);
    } catch (e) {
      console.error(e);
    }
  };

  const viewPropertyDetails = async (propertyId) => {
    try {
      const { data } = await api.get(`${backendurl}/api/admin/properties/${propertyId}`);
      if (data.success) {
        setSelectedProperty(data.property);
        setShowModal(true);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800"
    };
    return badges[status] || "bg-gray-100 text-gray-800";
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return <div className="text-center py-6 text-gray-600">Loading properties...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Shared Admin Navbar */}
      <AdminNavbar />

      {/* Page Header */}
      <div className="p-4 sm:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                Property Management 🏠
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Review and manage property listings
              </p>
            </div>
            
            {/* Status Filter */}
            <div className="flex flex-wrap gap-2">
              {["pending", "approved", "rejected"].map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    setSelectedStatus(status);
                    if (status === "pending") {
                      markNotificationsSeen(); // Mark notifications as seen when viewing pending
                    }
                  }}
                  className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition text-sm relative ${
                    selectedStatus === status
                      ? "bg-[#3A2C99] text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-300"
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                  {status === "pending" && notificationCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {notificationCount}
                    </span>
                  )}
                </button>
              ))}
            </div>
        </div>

          {/* Properties Table/Cards */}
        {props.length > 0 ? (
            <div className="space-y-4">
              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto bg-white shadow-md rounded-xl">
            <table className="min-w-full text-sm text-gray-600">
                  <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
                <tr>
                      <th className="px-6 py-3 text-left">Property Details</th>
                  <th className="px-6 py-3 text-left">Owner</th>
                  <th className="px-6 py-3 text-left">Status</th>
                      <th className="px-6 py-3 text-left">Submitted</th>
                  <th className="px-6 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {props.map((p) => (
                  <tr key={p._id} className="border-t hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium text-gray-900">
                              {p.heading || `${p.properttyType} in ${p.city}`}
                            </div>
                            <div className="text-gray-500 text-sm">
                              ₹{p.rent?.toLocaleString()} • {p.city}, {p.state}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium">{p.user?.name || "Unknown"}</div>
                            <div className="text-gray-500 text-sm">{p.user?.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(p.status)}`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                          {formatDate(p.createdAt)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <button
                              onClick={() => viewPropertyDetails(p._id)}
                              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition"
                              title="View Details"
                            >
                              <Eye size={16} />
                            </button>
                            
                            {selectedStatus === "pending" && (
                              <>
                                <button
                                  onClick={() => action(p._id, "approve")}
                                  className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition"
                                  title="Approve"
                                >
                                  <CheckCircle size={16} />
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedProperty(p);
                                    setShowModal(true);
                                  }}
                                  className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
                                  title="Reject"
                                >
                                  <XCircle size={16} />
                                </button>
                              </>
                            )}
                            
                            {selectedStatus === "approved" && (
                              <button
                                onClick={() => action(p._id, "feature")}
                                className={`p-2 rounded-lg transition ${
                                  p.featured 
                                    ? "text-yellow-600 hover:bg-yellow-100" 
                                    : "text-gray-600 hover:bg-gray-100"
                                }`}
                                title={p.featured ? "Unfeature" : "Feature"}
                              >
                                <Star size={16} fill={p.featured ? "currentColor" : "none"} />
                              </button>
                            )}
                            
                            <button
                              onClick={() => action(p._id, "delete")}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile/Tablet Cards */}
              <div className="lg:hidden space-y-4">
                {props.map((p) => (
                  <div key={p._id} className="bg-white rounded-xl shadow-md p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {p.heading || `${p.properttyType} in ${p.city}`}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          ₹{p.rent?.toLocaleString()} • {p.city}, {p.state}
                        </p>
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(p.status)}`}>
                            {p.status}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatDate(p.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Owner: {p.user?.name || "Unknown"} ({p.user?.email})
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => viewPropertyDetails(p._id)}
                        className="px-3 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors flex items-center gap-1"
                      >
                        <Eye size={14} />
                        View Details
                      </button>
                      
                      {selectedStatus === "pending" && (
                        <>
                      <button
                        onClick={() => action(p._id, "approve")}
                            className="px-3 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition-colors flex items-center gap-1"
                          >
                            <CheckCircle size={14} />
                            Approve
                          </button>
                          <button
                            onClick={() => {
                              setSelectedProperty(p);
                              setShowModal(true);
                            }}
                            className="px-3 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors flex items-center gap-1"
                          >
                            <XCircle size={14} />
                            Reject
                          </button>
                        </>
                      )}
                      
                      {selectedStatus === "approved" && (
                        <button
                          onClick={() => action(p._id, "feature")}
                          className={`px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-1 ${
                            p.featured 
                              ? "bg-yellow-500 text-white hover:bg-yellow-600" 
                              : "bg-gray-500 text-white hover:bg-gray-600"
                          }`}
                        >
                          <Star size={14} fill={p.featured ? "currentColor" : "none"} />
                          {p.featured ? "Unfeature" : "Feature"}
                        </button>
                      )}
                      
                      <button
                        onClick={() => action(p._id, "delete")}
                        className="px-3 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors flex items-center gap-1"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🏠</div>
              <p className="text-gray-500 text-lg">
                No {selectedStatus} properties found
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Property Details Modal */}
      {showModal && selectedProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800">Property Details</h3>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedProperty(null);
                    setRejectionReason("");
                  }}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Property Images */}
                <div>
                  <h4 className="font-semibold mb-3">Property Images</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedProperty.roomImages?.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Property image ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </div>

                {/* Property Details */}
                <div>
                  <h4 className="font-semibold mb-3">Property Information</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Type:</strong> {selectedProperty.properttyType}</div>
                    <div><strong>Rent:</strong> ₹{selectedProperty.rent?.toLocaleString()}</div>
                    <div><strong>Deposit:</strong> {selectedProperty.deposit}</div>
                    <div><strong>Address:</strong> {selectedProperty.address}</div>
                    <div><strong>City:</strong> {selectedProperty.city}, {selectedProperty.state}</div>
                    <div><strong>Postal Code:</strong> {selectedProperty.postalCode}</div>
                    <div><strong>Available From:</strong> {selectedProperty.availabilityMonth} {selectedProperty.availabilityDay}</div>
                  </div>
                </div>

                {/* Owner Details */}
                <div>
                  <h4 className="font-semibold mb-3">Owner Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <Phone size={16} className="mr-2" />
                      {selectedProperty.user?.phone || selectedProperty.phone}
                    </div>
                    <div className="flex items-center">
                      <Mail size={16} className="mr-2" />
                      {selectedProperty.user?.email || selectedProperty.email}
                    </div>
                    <div className="flex items-center">
                      <MapPin size={16} className="mr-2" />
                      {selectedProperty.user?.name || "Unknown Owner"}
                    </div>
                  </div>
                </div>

                {/* Status Information */}
                <div>
                  <h4 className="font-semibold mb-3">Verification Status</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Status:</strong> 
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(selectedProperty.status)}`}>
                        {selectedProperty.status}
                      </span>
                    </div>
                    {selectedProperty.verifiedAt && (
                      <div className="flex items-center">
                        <Calendar size={16} className="mr-2" />
                        <strong>Verified:</strong> {formatDate(selectedProperty.verifiedAt)}
                      </div>
                    )}
                    {selectedProperty.rejectionReason && (
                      <div>
                        <strong>Rejection Reason:</strong>
                        <p className="text-red-600 text-sm mt-1">{selectedProperty.rejectionReason}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-6 border-t">
                <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                  {selectedProperty.status === "pending" && (
                    <>
                      <button
                        onClick={() => action(selectedProperty._id, "approve")}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                      >
                        <CheckCircle size={16} />
                        Approve Property
                      </button>
                      <button
                        onClick={() => {
                          if (rejectionReason.trim()) {
                            action(selectedProperty._id, "reject", rejectionReason);
                          } else {
                            alert("Please provide a rejection reason");
                          }
                        }}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                      >
                        <XCircle size={16} />
                        Reject Property
                      </button>
                    </>
                  )}
                  
                  <button
                    onClick={() => action(selectedProperty._id, "delete")}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 size={16} />
                    Delete Property
                  </button>
                </div>

                {/* Rejection Reason Input */}
                {selectedProperty.status === "pending" && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rejection Reason (Optional)
                    </label>
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Please provide a reason for rejection..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3A2C99] focus:border-transparent resize-none"
                      rows={3}
                    />
                  </div>
                )}
                
                {selectedProperty.status === "approved" && (
                  <div className="flex space-x-4">
                    <button
                      onClick={() => action(selectedProperty._id, "feature")}
                      className={`flex-1 py-3 px-6 rounded-lg transition font-medium ${
                        selectedProperty.featured
                          ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                          : "bg-gray-600 hover:bg-gray-700 text-white"
                      }`}
                    >
                      {selectedProperty.featured ? "★ Unfeature Property" : "☆ Feature Property"}
                    </button>
                  </div>
                )}
                
                <div className="mt-4">
                  <button
                    onClick={() => action(selectedProperty._id, "delete")}
                    className="w-full bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition font-medium"
                  >
                    🗑️ Delete Property
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}
    </div>
  );
}
