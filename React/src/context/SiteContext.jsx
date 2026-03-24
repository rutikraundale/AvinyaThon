import { createContext, useContext, useState } from "react";

const SiteContext = createContext();

export const SiteProvider = ({ children }) => {
  const [selectedSite, setSelectedSite] = useState(null);

  return (
    <SiteContext.Provider value={{ selectedSite, setSelectedSite }}>
      {children}
    </SiteContext.Provider>
  );
};

export const useSite = () => useContext(SiteContext);