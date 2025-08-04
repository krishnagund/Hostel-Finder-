import userModel from "../models/userModel.js";

// 🧠 Get current user data
export const getUserData = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      userData: {
        name: user.name,
        isAccountVerified: user.isAccountVerified,
      },
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// ❤️ Toggle favorite property
export const toggleFavorite = async (req, res) => {
  const userId = req.userId;
  const propertyId = req.params.propertyId;

  try {
    const user = await userModel.findById(userId);

    const isAlreadyFavorited = user.favorites.includes(propertyId);

    if (isAlreadyFavorited) {
      user.favorites = user.favorites.filter(
        (favId) => favId.toString() !== propertyId
      );
    } else {
      user.favorites.push(propertyId);
    }

    await user.save();

    res.status(200).json({ message: "Favorite updated", favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ message: "Error toggling favorite", error });
  }
};

// 🧾 Get all favorited properties
export const getFavorites = async (req, res) => {
  const userId = req.userId;

  try {
    const user = await userModel.findById(userId).populate("favorites");

    res.status(200).json({ favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ message: "Error fetching favorites", error });
  }
};
