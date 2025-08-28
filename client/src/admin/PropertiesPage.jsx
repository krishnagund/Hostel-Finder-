import React, { useEffect, useState,useContext } from "react";
import api from "../utils/axiosInstance";
import { assets } from "../assets/assets";
import { AppContext } from "../context/Appcontext";

export default function PropertiesPage() {
  const [props, setProps] = useState([]);
  const [loading, setLoading] = useState(true);
  const { backendurl } = useContext(AppContext);

  const load = async () => {
    try {
      const { data } = await api.get(backendurl+"/api/admin/properties?status=pending");
      if (data.success) setProps(data.properties);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const action = async (id, type) => {
    if (!window.confirm(`${type} this property?`)) return;
    try {
      await api.put(`/admin/properties/${id}/${type}`);
      await load();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="text-center py-6 text-gray-600">Loading properties...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ✅ Navbar (same as Stats Page) */}
      <nav className="bg-white shadow-md px-6 py-3 flex items-center justify-between sticky top-0 z-50">
         <div
          className="flex items-center space-x-2 text-2xl sm:text-3xl font-bold cursor-pointer"
          onClick={() => navigate("/admin")}
        >
          <img
            src={assets.logo1}
            alt="Hostel Finder Logo"
            className="h-12 w-12 sm:h-16 sm:w-16 object-contain"
          />
          <span className="text-gray-800">Admin</span>
          <span className="text-[#3A2C99] italic">Panel</span>
        </div>
        <img src={assets.admin} alt="Admin Logo" className="h-10 w-10 object-contain" />
      </nav>

      {/* ✅ Page Header */}
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center md:text-left">
          Pending Properties 🏠
        </h2>

        {/* ✅ Properties Table / Cards */}
        {props.length > 0 ? (
          <div className="overflow-x-auto bg-white shadow-md rounded-xl">
            <table className="min-w-full text-sm text-gray-600">
              <thead className="bg-gray-200 text-gray-700 uppercase text-xs">
                <tr>
                  <th className="px-6 py-3 text-left">Title</th>
                  <th className="px-6 py-3 text-left">Owner</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {props.map((p) => (
                  <tr key={p._id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-3 font-medium">{p.title || p.name}</td>
                    <td className="px-6 py-3">{p.ownerEmail || p.owner?.email}</td>
                    <td className="px-6 py-3 capitalize">{p.status}</td>
                    <td className="px-6 py-3 text-center space-x-2">
                      <button
                        onClick={() => action(p._id, "approve")}
                        className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => action(p._id, "reject")}
                        className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => action(p._id, "feature")}
                        className="px-3 py-1 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
                      >
                        Feature
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center mt-6">No pending properties 🎉</p>
        )}
      </div>
    </div>
  );
}
