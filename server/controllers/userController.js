import userModel from "../models/userModel.js";

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
        email: user.email,
        phone: user.phone,
        role: user.role,
        isAccountVerified: user.isAccountVerified,
      },
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};


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

export const getFavorites = async (req, res) => {
  const userId = req.userId;

  try {
    const user = await userModel.findById(userId).populate("favorites");

    res.status(200).json({ favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ message: "Error fetching favorites", error });
  }
};
