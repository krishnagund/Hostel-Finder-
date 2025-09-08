import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axiosInstance";
import { assets } from "../assets/assets";
import { AppContext } from "../context/Appcontext";
import AdminNavbar from "../components/AdminNavbar";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { backendurl } = useContext(AppContext);
  const navigate = useNavigate();

  const load = async () => {
    try {
      const { data } = await api.get(`${backendurl}/api/admin/users`);
      if (data.success) setUsers(data.users);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const changeRole = async (id, role) => {
    if (!window.confirm(`Change role to ${role}?`)) return;
    try {
      await api.put(`${backendurl}/api/admin/users/${id}/role`, { role });
      await load();
    } catch (e) {
      console.error(e);
    }
  };

  const toggleBlock = async (id) => {
    if (!window.confirm(`Toggle block for this user?`)) return;
    try {
      await api.put(`${backendurl}/api/admin/users/${id}/block`);
      await load();
    } catch (e) {
      console.error(e);
    }
  };

  const del = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await api.delete(`${backendurl}/api/admin/users/${id}`);
      await load();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNavbar />
        <div className="text-center py-8 text-gray-600">Loading users...</div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Shared Admin Navbar */}
      <AdminNavbar />

      {/* Page Content */}
      <main className="p-4 sm:p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                  User Management 👥
                </h1>
                <p className="text-gray-600 text-sm sm:text-base">
                  Manage user accounts and permissions
                </p>
              </div>
              <div className="mt-4 sm:mt-0">
                <div className="bg-white px-4 py-2 rounded-lg shadow-sm border">
                  <span className="text-sm text-gray-600">Total Users: </span>
                  <span className="font-semibold text-indigo-600">{users.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto bg-white shadow-lg rounded-xl border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-indigo-50 to-purple-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    User Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                              {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{u.name}</div>
                          <div className="text-sm text-gray-500">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                          u.role === "admin"
                            ? "bg-indigo-100 text-indigo-800"
                            : u.role === "owner"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          u.isBlocked
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {u.isBlocked ? "Blocked" : "Active"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => toggleBlock(u._id)}
                          className={`px-3 py-1.5 text-xs rounded-lg transition-all duration-200 font-medium ${
                            u.isBlocked
                              ? "bg-green-500 text-white hover:bg-green-600 shadow-sm"
                              : "bg-orange-500 text-white hover:bg-orange-600 shadow-sm"
                          }`}
                        >
                          {u.isBlocked ? "Unblock" : "Block"}
                        </button>
                        <button
                          onClick={() => del(u._id)}
                          className="px-3 py-1.5 text-xs rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all duration-200 font-medium shadow-sm"
                        >
                          Delete
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
            {users.map((u) => (
              <div
                key={u._id}
                className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-200"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 h-12 w-12">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">
                        {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">{u.name}</h3>
                    <p className="text-sm text-gray-600 truncate">{u.email}</p>
                    <div className="flex gap-2 mt-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                          u.role === "admin"
                            ? "bg-indigo-100 text-indigo-800"
                            : u.role === "owner"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {u.role}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          u.isBlocked
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {u.isBlocked ? "Blocked" : "Active"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => toggleBlock(u._id)}
                    className={`px-4 py-2 text-sm rounded-lg transition-all duration-200 font-medium ${
                      u.isBlocked
                        ? "bg-green-500 text-white hover:bg-green-600 shadow-sm"
                        : "bg-orange-500 text-white hover:bg-orange-600 shadow-sm"
                    }`}
                  >
                    {u.isBlocked ? "Unblock" : "Block"}
                  </button>
                  <button
                    onClick={() => del(u._id)}
                    className="px-4 py-2 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all duration-200 font-medium shadow-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {users.length === 0 && (
            <div className="text-center py-16">
              <div className="text-gray-400 text-8xl mb-6">👥</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No users found</h3>
              <p className="text-gray-500">There are no users in the system yet.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
