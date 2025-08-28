import React, { useEffect, useState,useContext } from "react";
import { useLanguage } from "../context/LanguageContext";
import { AppContext } from "../context/Appcontext";

const RenterInfo = ({ text }) => {
  const { language } = useLanguage();
  const [translatedText, setTranslatedText] = useState(text);
  const { backendurl } = useContext(AppContext);

  useEffect(() => {
    if (language === "hi") {
      fetch(backendurl+"/api/stats/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
      })
        .then((res) => res.json())
        .then((data) => setTranslatedText(data.translatedText))
        .catch(() => setTranslatedText(text));
    } else {
      setTranslatedText(text); // back to English
    }
  }, [language, text]);

  return <span>{translatedText}</span>;
};

export default RenterInfo;
