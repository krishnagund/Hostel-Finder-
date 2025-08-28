import { useEffect, useState, useContext } from "react";
import { AppContext } from "../context/Appcontext";
import { FaCity, FaUsers, FaChartLine, FaHome } from "react-icons/fa";
import RenterInfo from "../components/RenterInfo";
import TranslatedText from "../components/TranslatedText"; // ✅ added

const StatsSection = () => {
  const { backendurl } = useContext(AppContext);
  const [stats, setStats] = useState({
    properties: 0,
    cities: 0,
    growth: 0,
    users: 0,
  });

  const fetchStats = async () => {
    try {
      const res = await fetch(`${backendurl}/api/stats`);
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Error fetching stats", err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <section className="py-20 bg-gray-100 mt-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 text-center">
          {/* Properties */}
          <div className="bg-white rounded-2xl shadow-lg p-10 hover:-translate-y-2 hover:shadow-2xl transition duration-300">
            <FaHome className="text-blue-500 text-5xl mx-auto mb-5" />
            <h2 className="text-4xl font-extrabold text-gray-800">
              <TranslatedText text={stats.properties.toLocaleString()} />
            </h2>
            <p className="text-gray-600 mt-3 text-lg">
              <RenterInfo text="Total Properties" />
            </p>
          </div>

          {/* Cities */}
          <div className="bg-white rounded-2xl shadow-lg p-10 hover:-translate-y-2 hover:shadow-2xl transition duration-300">
            <FaCity className="text-green-500 text-5xl mx-auto mb-5" />
            <h2 className="text-4xl font-extrabold text-gray-800">
              <TranslatedText text={stats.cities.toString()} />
            </h2>
            <p className="text-gray-600 mt-3 text-lg">
              <RenterInfo text="Cities Covered" />
            </p>
          </div>

          {/* Growth */}
          <div className="bg-white rounded-2xl shadow-lg p-10 hover:-translate-y-2 hover:shadow-2xl transition duration-300">
            <FaChartLine className="text-purple-500 text-5xl mx-auto mb-5" />
            <h2 className="text-4xl font-extrabold text-gray-800">
              <TranslatedText text={`${stats.growth}%`} />
            </h2>
            <p className="text-gray-600 mt-3 text-lg">
              <RenterInfo text="Market Growth" />
            </p>
          </div>

          {/* Users */}
          <div className="bg-white rounded-2xl shadow-lg p-10 hover:-translate-y-2 hover:shadow-2xl transition duration-300">
            <FaUsers className="text-orange-500 text-5xl mx-auto mb-5" />
            <h2 className="text-4xl font-extrabold text-gray-800">
              <TranslatedText text={`${stats.users.toLocaleString()}+`} />
            </h2>
            <p className="text-gray-600 mt-3 text-lg">
              <RenterInfo text="Active Users" />
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
