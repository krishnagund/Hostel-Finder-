import { useState, useEffect,useContext } from "react";
import { useLanguage } from "../context/LanguageContext";
import { AppContext } from "../context/Appcontext";

export function useTranslate(text) {
  const { language } = useLanguage();
  const [translated, setTranslated] = useState(text);
  const {backendurl}=useContext(AppContext)

  useEffect(() => {
    const translateText = async () => {
      if (language === "en") {
        setTranslated(text); // keep original
      } else {
        try {
          const res = await fetch(backendurl+"/api/stats/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text, targetLang: language }),
          });
          const data = await res.json();
          setTranslated(data.translatedText || text);
        } catch (err) {
          console.error("Translation failed", err);
          setTranslated(text);
        }
      }
    };

    if (text) translateText();
  }, [text, language]);

  return translated;
}
