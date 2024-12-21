// CreateSidebarContext.js
import React, { createContext, useContext, useState } from 'react';

const Sidebar_Context = createContext();

export const useMyContext = () => {
  return useContext(Sidebar_Context);
};

export const SidebarProvider = ({ children }) => {
  const [SidebarToggle, setSidebarToggle] = useState(false);


// toggleSidebar
const toggleSidebar = () =>{
  setSidebarToggle(!SidebarToggle)
}


  return (
    <Sidebar_Context.Provider value={{toggleSidebar , SidebarToggle}}>
      {children}
    </Sidebar_Context.Provider>
  );
};
