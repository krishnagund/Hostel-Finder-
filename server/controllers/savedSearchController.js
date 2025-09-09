import SavedSearch from "../models/savedSearchModel.js";

export const createSavedSearch = async (req, res) => {
  try {
    const userId = req.userId;
    const { city, rentMin = 0, rentMax = 100000, availabilityMonth = "", availabilityDay = "", types = [] } = req.body || {};
    if (!city || !city.toString().trim()) {
      return res.status(400).json({ success: false, message: "City is required" });
    }

    const normalized = {
      user: userId,
      city: city.toString().trim(),
      rentMin: Number.isFinite(+rentMin) ? +rentMin : 0,
      rentMax: Number.isFinite(+rentMax) ? +rentMax : 100000,
      availabilityMonth: availabilityMonth || "",
      availabilityDay: availabilityDay || "",
      types: Array.isArray(types) ? types.filter(Boolean) : [],
    };

    const doc = await SavedSearch.create(normalized);

    return res.json({ success: true, savedSearch: doc });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const listSavedSearches = async (req, res) => {
  try {
    const userId = req.userId;
    const docs = await SavedSearch.find({ user: userId }).sort({ updatedAt: -1 });
    return res.json({ success: true, savedSearches: docs });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteSavedSearch = async (req, res) => {
  try {
    const userId = req.userId;
    const id = req.params.id;
    const doc = await SavedSearch.findOneAndDelete({ _id: id, user: userId });
    if (!doc) return res.status(404).json({ success: false, message: "Not found" });
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};


