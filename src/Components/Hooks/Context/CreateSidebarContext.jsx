// CreateSidebarContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

const Sidebar_Context = createContext();

export const useMyContext = () => {
  return useContext(Sidebar_Context);
};

export const SidebarProvider = ({ children }) => {
  const [SidebarToggle, setSidebarToggle] = useState(false);

  // toggleSidebar
  const toggleSidebar = () => {
    setSidebarToggle(!SidebarToggle);
    // $("#main-wrapper").toggleClass("menu-toggle");
  };

  const main_wrapper = () => {
    // $("#main-wrapper").toggleClass("menu-toggle");
  };

  const handleResize = () => {
    if (window.innerWidth <= 768) {
      setSidebarToggle(true);
    } else {
      setSidebarToggle(false);
    }
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Sidebar_Context.Provider
      value={{ main_wrapper, toggleSidebar, SidebarToggle }}
    >
      {children}
    </Sidebar_Context.Provider>
  );
};
