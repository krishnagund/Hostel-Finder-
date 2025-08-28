import { useEffect, useState, useContext } from "react";
import { AppContext } from "../context/Appcontext";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import RenterInfo from "../components/RenterInfo";
import TranslatedText from "../components/TranslatedText";

const TopCities = () => {
  const { backendurl } = useContext(AppContext);
  const [cities, setCities] = useState([]);
  const navigate = useNavigate();

  const cityImages = [
    assets.city1,
    assets.city2,
    assets.city3,
    assets.city4,
    assets.city5,
    assets.city6,
    assets.city7,
  ];

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await fetch(`${backendurl}/api/stats/top-cities`);
        const data = await res.json();

        const topCities = data
          .sort((a, b) => b.totalProperties - a.totalProperties)
          .slice(0, 6);

        const withImages = topCities.map((city, idx) => ({
          ...city,
          image: cityImages[idx % cityImages.length],
        }));

        setCities(withImages);
      } catch (err) {
        console.error("Error fetching cities", err);
      }
    };
    fetchCities();
  }, [backendurl]);

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 text-center">
        {/* Static text */}
        <h2 className="text-4xl font-bold mb-4 text-gray-800">
          <RenterInfo text="Explore Top Cities" />
        </h2>
        <p className="text-gray-600 mb-10">
          <RenterInfo text="Discover rental opportunities across India's most vibrant cities" />
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {cities.map((city, idx) => (
            <div
              key={idx}
              onClick={() =>
                navigate(`/hostels?city=${encodeURIComponent(city._id.city)}`)
              }
              className="relative rounded-2xl overflow-hidden shadow-lg hover:scale-105 transition-transform cursor-pointer"
            >
              <img
                src={city.image}
                alt={city._id.city}
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-6">
                {/* Dynamic text */}
                <h3 className="text-2xl font-bold text-white">
                  <TranslatedText text={city._id.city} />,{" "}
                  <TranslatedText text={city._id.state} />
                </h3>

                <p className="text-gray-200 mt-1">
                  <TranslatedText text={`${city.totalProperties}+ properties`} />
                </p>

                <p className="text-lg font-semibold text-orange-400 mt-2">
                  <RenterInfo text="Avg Rent:" /> ₹
                  <TranslatedText
                    text={Math.round(city.averageRent).toLocaleString()}
                  />
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopCities;
