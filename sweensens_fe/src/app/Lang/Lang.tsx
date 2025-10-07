"use client";
import { createContext, useContext, useState } from "react";

type LangType = "TH" | "EN";

interface LangContextType {
  lang: LangType;
  changeLang: (value: LangType) => void;
}

const LanguageContext = createContext<LangContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLang] = useState<LangType>("TH");

  const changeLang = (value: LangType) => setLang(value);

  return (
    <LanguageContext.Provider value={{ lang, changeLang }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};
