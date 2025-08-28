import React, { useEffect, useState,useContext} from "react";
import api from "../utils/axiosInstance";
import { assets } from "../assets/assets"; 
import { AppContext } from "../context/Appcontext";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { backendurl } = useContext(AppContext);

  const load = async () => {
    try {
      const { data } = await api.get(backendurl+"/api/admin/users");
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
      await api.put(`/admin/users/${id}/role`, { role });
      await load();
    } catch (e) {
      console.error(e);
    }
  };

  const toggleBlock = async (id) => {
    if (!window.confirm(`Toggle block for this user?`)) return;
    try {
      await api.put(`/admin/users/${id}/block`);
      await load();
    } catch (e) {
      console.error(e);
    }
  };

  const del = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await api.delete(`/admin/users/${id}`);
      await load();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading)
    return (
      <div className="text-center py-8 text-gray-600">Loading users...</div>
    );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ✅ Navbar (same as AdminDashboard) */}
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
        <img
          src={assets.admin}
          alt="Admin Logo"
          className="h-10 w-10 object-contain"
        />
      </nav>

      {/* ✅ Page Content */}
      <main className="p-6">
        <h3 className="text-2xl font-bold mb-6 text-gray-800">
          Users Management
        </h3>

        {/* ✅ Table on large screens */}
        <div className="hidden md:block overflow-x-auto bg-white shadow rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {u.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {u.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        u.role === "admin"
                          ? "bg-indigo-100 text-indigo-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm flex gap-2 justify-center">
                    <button
                      onClick={() =>
                        changeRole(
                          u._id,
                          u.role === "admin" ? "student" : "admin"
                        )
                      }
                      className="px-3 py-1 text-xs rounded-md bg-blue-500 text-white hover:bg-blue-600"
                    >
                      {u.role === "admin" ? "Demote" : "Make Admin"}
                    </button>
                    <button
                      onClick={() => toggleBlock(u._id)}
                      className={`px-3 py-1 text-xs rounded-md ${
                        u.isBlocked
                          ? "bg-yellow-500 text-white hover:bg-yellow-600"
                          : "bg-gray-500 text-white hover:bg-gray-600"
                      }`}
                    >
                      {u.isBlocked ? "Unblock" : "Block"}
                    </button>
                    <button
                      onClick={() => del(u._id)}
                      className="px-3 py-1 text-xs rounded-md bg-red-500 text-white hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ✅ Card layout on mobile */}
        <div className="grid gap-4 md:hidden">
          {users.map((u) => (
            <div
              key={u._id}
              className="bg-white p-4 rounded-lg shadow flex flex-col gap-2"
            >
              <div className="flex justify-between items-center">
                <h4 className="font-semibold text-gray-800">{u.name}</h4>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    u.role === "admin"
                      ? "bg-indigo-100 text-indigo-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {u.role}
                </span>
              </div>
              <p className="text-sm text-gray-600">{u.email}</p>

              <div className="flex flex-wrap gap-2 mt-2">
                <button
                  onClick={() =>
                    changeRole(u._id, u.role === "admin" ? "student" : "admin")
                  }
                  className="px-3 py-1 text-xs rounded-md bg-blue-500 text-white hover:bg-blue-600"
                >
                  {u.role === "admin" ? "Demote" : "Make Admin"}
                </button>
                <button
                  onClick={() => toggleBlock(u._id)}
                  className={`px-3 py-1 text-xs rounded-md ${
                    u.isBlocked
                      ? "bg-yellow-500 text-white hover:bg-yellow-600"
                      : "bg-gray-500 text-white hover:bg-gray-600"
                  }`}
                >
                  {u.isBlocked ? "Unblock" : "Block"}
                </button>
                <button
                  onClick={() => del(u._id)}
                  className="px-3 py-1 text-xs rounded-md bg-red-500 text-white hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
