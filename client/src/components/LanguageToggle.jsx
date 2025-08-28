import { useLanguage } from "../context/LanguageContext";

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="inline-flex border rounded-md overflow-hidden">
      {/* English Button */}
      <button
        onClick={() => setLanguage("en")}
        className={`px-4 py-2 font-semibold ${
          language === "en"
            ? "bg-[#3A2C99] text-white"
            : "bg-white text-gray-700 hover:bg-gray-100"
        }`}
      >
        EN
      </button>

      {/* Hindi Button */}
      <button
        onClick={() => setLanguage("hi")}
        className={`px-4 py-2 font-semibold ${
          language === "hi"
            ? "bg-[#3A2C99] text-white"
            : "bg-white text-gray-700 hover:bg-gray-100"
        }`}
      >
        HI
      </button>
    </div>
  );
}
