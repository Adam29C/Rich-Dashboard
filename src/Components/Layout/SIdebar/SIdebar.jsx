import React, { useState } from "react";
import { admin_Sidebar } from "./Sidebar_data";
import { Link } from "react-router-dom";
import PagesIndex from "../../Pages/PagesIndex";
import { Get_permissions } from "../../Redux/slice/CommonSlice";
import { filterSidebarItems } from "./FilteredPermissions";
import Logo from "../Logo/Logo_png";

const SIdebar = () => {
  let { user_id, role } = JSON.parse(localStorage.getItem("userdetails"));

  const { getPermissions } = PagesIndex.useSelector(
    (state) => state.CommonSlice
  );
  const dispatch = PagesIndex.useDispatch();

  const [expandedItem, setExpandedItem] = useState(null);

  console.log("expandedItem", expandedItem);

  const getPermissionApi = () => {
    dispatch(Get_permissions(user_id));
  };

  PagesIndex.useEffect(() => {
    getPermissionApi();
  }, []);

  const handleToggle = (index) => {
    setExpandedItem(expandedItem === index ? null : index);

    $("#main-wrapper").addClass("menu-toggle");
  };
  const filteredSidebar = filterSidebarItems(
    admin_Sidebar,
    role,
    getPermissions
  );

  return (
    <div className="nk-sidebar">
      <div
        className="slimScrollDiv"
        style={{
          position: "relative",
          overflow: "hidden",
          width: "auto",
          height: "100%",
        }}
      >
        <div
          className="nk-nav-scroll active"
          style={{ overflowY: "auto", width: "auto", height: "100%" }}
        >
          {/* <Logo/> */}
          <ul className="metismenu in" id="menu">
            {filteredSidebar &&
              filteredSidebar.map((item, index) => {
                const isActive = expandedItem === index;
                const hasNested = item.NestedElement.length > 0;

                return (
                  <div key={`${item.headerTitle}_${index}`}>
                    <li
                      className={`${isActive ? "active" : ""}`}
                      key={`${item.headerTitle}_${index}`}
                    >
                      {(item.permission != null || "null") && (
                        <Link
                          to={hasNested ? "#" : item.route}
                          className={
                            item.NestedElement.length > 0 ? "has-arrow" : ""
                          }
                          aria-expanded={isActive}
                          onClick={() => handleToggle(index)}
                        >
                          <i className={`${item.Icon} menu-icon me-2`} />
                          <span className="nav-text">{item.title}</span>
                        </Link>
                      )}

                      <ul
                        aria-expanded={isActive}
                        className={`collapse ${isActive ? "in" : ""}`}
                      >
                        {item.NestedElement.map((nested) => (
                          <li
                            key={nested.id}
                            className={isActive ? "active" : ""}
                          >
                            <Link
                              to={nested.route}
                              className={isActive ? "active" : ""}
                            >
                              {nested.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                  </div>
                );
              })}
          </ul>
        </div>

        <div
          className="slimScrollRail"
          style={{
            width: 5,
            height: "100%",
            position: "absolute",
            top: 0,
            display: "none",
            borderRadius: 7,
            background: "rgb(51, 51, 51)",
            opacity: "0.2",
            zIndex: 90,
            right: 1,
          }}
        />
      </div>
    </div>
  );
};

export default SIdebar;
