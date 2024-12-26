// CreateSidebarContext.js
import React, { createContext, useContext, useState, useEffect, useRef } from "react";

const Sidebar_Context = createContext();

export const useMyContext = () => {
  return useContext(Sidebar_Context);
};

export const SidebarProvider = ({ children }) => {
  
  const [SidebarToggle, setSidebarToggle] = useState(false);
  const sidebarRef = useRef(null);
  // toggleSidebar
  const toggleSidebar = () => {
    setSidebarToggle(!SidebarToggle);
    // $("#main-wrapper").toggleClass("menu-toggle");
  };

  const main_wrapper = () => {
    if (window.innerWidth <= 768) {
      $("#main-wrapper").toggleClass("menu-toggle");
    }
  };

  const handleResize = () => {
    if (window.innerWidth <= 768) {
      setSidebarToggle(true);
    } else {
      setSidebarToggle(false);
    }
  };

  const handleClickOutside = (event) => {
    const mainWrapper = document.getElementById("main-wrapper");
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      //  // Close sidebar
      if (mainWrapper) {
      }
    }
  };


  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousedown", handleClickOutside);

    };
  }, []);

  return (
    <Sidebar_Context.Provider
      value={{ main_wrapper, toggleSidebar, SidebarToggle,sidebarRef  }}
    >
      {children}
    </Sidebar_Context.Provider>
  );
};
