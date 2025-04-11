import React from "react";
import logo from "../../../assets/Images/headerlogo.svg"
const Logo = () => {
  return (
    <div className="nav-header">
      <div className="brand-logo">
        <a href="#">
          <b className="logo-abbr">
            <span id="sidebar-logo-short"></span>
            {/* <img 
               id="sidebar-logo-short"
              src="/assets/images/favicon.png"
               alt="ddd" /> */}
          </b>
          {/* <span  className="logo-compact"> */}
          <span id="sidebar-logo-short"></span>
          {/* </span> */}
          <span className="brand-title">
            <img className="sidebar-logo"  src={logo} alt="logo"/>
          </span>
        </a>
      </div>
    </div>
  );
};

export default Logo;
