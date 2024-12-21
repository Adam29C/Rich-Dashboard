import { useState } from "react";
import Logo from "../Logo/Logo.jsx";
import Header from "../Header/Header.jsx";
import SIdebar from "../SIdebar/SIdebar";
import Main_Contain from "../Main/Main_Containt.jsx";

import Footer from "../Footer/Footer.jsx";
import Dashboard from "../../Pages/Superadmin/Dashboard/Dashboard.jsx";
import {
  SidebarProvider,
  useMyContext,
} from "../../Hooks/Context/CreateSidebarContext.jsx";
import { Outlet } from "react-router-dom";

function MainContent() {
  const { SidebarToggle } = useMyContext();



  return (
    <div
      id={`main-wrapper `}
      className={`show ${SidebarToggle ? "menu-toggle" : ""}`}
    >
      <Logo />
      <Header />
      <SIdebar />
      {/* <Dashboard /> */}
      <Outlet/>
      outlet
      <Footer />
    </div>
  );
}

function App() {
  return (
    <SidebarProvider>
      <MainContent />
    </SidebarProvider>
  );
}

export default App;
