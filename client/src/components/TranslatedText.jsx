// src/components/TranslatedText.jsx
import { useTranslate } from "../hooks/useTranslate";

const TranslatedText = ({ text }) => {
  const translated = useTranslate(text);
  return <>{translated}</>;
};

export default TranslatedText;
