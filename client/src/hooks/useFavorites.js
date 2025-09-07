import { useState, useEffect, useContext } from "react";
import { AppContext } from "../context/Appcontext";

export const useFavorites = () => {
  const { backendurl, isLoggedin } = useContext(AppContext);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch favorites from backend
  const fetchFavorites = async () => {
    if (!isLoggedin) {
      setFavorites([]);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${backendurl}/api/user/favorites`, {
        credentials: "include",
      });
      const data = await res.json();
      // Handle both populated objects and IDs
      const favoriteIds = data.favorites?.map(fav => 
        typeof fav === 'string' ? fav : fav._id
      ) || [];
      setFavorites(favoriteIds);
    } catch (err) {
      console.error("Error fetching favorites", err);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  // Toggle favorite status
  const toggleFavorite = async (propertyId) => {
    if (!isLoggedin) {
      throw new Error("User not logged in");
    }

    if (!propertyId) {
      throw new Error("Property ID is required");
    }

    try {
      const res = await fetch(`${backendurl}/api/user/favorites/${propertyId}`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      if (data.favorites) {
        // Backend returns array of IDs directly
        setFavorites(data.favorites);
        console.log("Favorites updated:", data.favorites);
      }
    } catch (err) {
      console.error("Error toggling favorite", err);
      throw err;
    }
  };

  // Check if property is favorited
  const isFavorited = (propertyId) => {
    if (!propertyId || !Array.isArray(favorites)) {
      return false;
    }
    return favorites.includes(propertyId);
  };

  // Load favorites when user logs in
  useEffect(() => {
    if (isLoggedin) {
      fetchFavorites();
    } else {
      setFavorites([]);
    }
  }, [isLoggedin]);

  return {
    favorites,
    loading,
    isFavorited,
    toggleFavorite,
    fetchFavorites,
  };
};
