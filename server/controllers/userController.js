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
        studentProfile: user.studentProfile || {},
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

export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const {
      name,
      phone,
      studentProfile = {},
    } = req.body;

    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (typeof name === 'string' && name.trim()) user.name = name.trim();
    if (typeof phone === 'string' && phone.trim()) user.phone = phone.trim();

    user.studentProfile = {
      ...user.studentProfile?.toObject?.() || user.studentProfile || {},
      ...studentProfile,
    };

    await user.save();

    return res.json({ success: true, message: "Profile updated", user: {
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isAccountVerified: user.isAccountVerified,
      studentProfile: user.studentProfile,
    }});
  } catch (error) {
    console.error('updateUserProfile error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
