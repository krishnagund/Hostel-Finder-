import Property from '../models/propertyModel.js';
import userModel from "../models/userModel.js";
import fetch from 'node-fetch'; 


const cache = new Map();
const TTL_MS = 60 * 60 * 1000; // 1 hour

function key(text, sourceLang, targetLang) {
  return `${sourceLang}|${targetLang}|${text}`;
}

export async function translateText(text, sourceLang = 'en', targetLang = 'hi') {
  try {
    const k = key(text, sourceLang, targetLang);
    const now = Date.now();
    const cached = cache.get(k);
    if (cached && now - cached.t < TTL_MS) return cached.v;

    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
      text
    )}&langpair=${sourceLang}|${targetLang}`;

    const response = await fetch(url);
    const data = await response.json();
    const translated = data?.responseData?.translatedText || text;

    cache.set(k, { v: translated, t: now });
    return translated;
  } catch (err) {
    console.error('Translation error:', err);
    return text; // fallback to original text
  }
}


export const translateTextHandler = async (req, res) => {
  try {
    const { text, texts, source = 'en', target = 'hi' } = req.body || {};

    if (Array.isArray(texts)) {
      const out = await Promise.all(texts.map(t => translateText(t, source, target)));
      return res.json({ translated: out });
    }

    if (!text) return res.status(400).json({ message: "text or texts[] required" });

    const translatedText = await translateText(text, source, target);
    res.json({ translatedText });
  } catch (err) {
    console.error('TranslateTextHandler error:', err);
    res.status(500).json({ message: "Translation failed" });
  }
};



export const getStats = async (req, res) => {
  try {
    const properties = await Property.countDocuments();
    const cities = await Property.distinct("city");
    const users = await userModel.countDocuments();

    const growth = 15;

    res.json({
      properties,
      cities: cities.length,
      users,
      growth,
    });
  } catch (err) {
    console.error("Error fetching stats:", err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
};

export const gettopcity = async (req, res) => {
  try {
    const cities = await Property.aggregate([
      {
        $group: {
          _id: { city: "$city", state: "$state" },
          totalProperties: { $sum: 1 },
          averageRent: { $avg: "$rent" }
        }
      },
      { $sort: { totalProperties: -1 } }, // sort by number of properties
      { $limit: 6 } // top 6 cities
    ]);

    res.json(cities);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching top cities" });
  }
};

