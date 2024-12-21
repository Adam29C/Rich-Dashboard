import { jwtDecode } from "jwt-decode";

export const GetExpired = (tokenExpiry, navigate) => {
  const decoded = jwtDecode(tokenExpiry && tokenExpiry);

  // console.log("navigate", navigate);

  if (decoded.exp < parseInt(Date.now() / 1000)) {
    navigate("/tokenexpiry", { replace: true });
    localStorage.removeItem("token");
    localStorage.removeItem("userdetails");
    // setTimeout(() => {
    // }, 1000);
  } else {
    return "not Expired";
  }
};

// import jwtDecode from "jwt-decode";

// export const GetExpired = (tokenExpiry, navigate) => {
  // if (!tokenExpiry) {
  //   console.error("Token is missing or undefined");
  //   return;
  // }

  // try {
  //   const decoded = jwtDecode(tokenExpiry);

  //   console.log("Decoded Token:", decoded);
  //   console.log("Token Expiry:", tokenExpiry);
  //   console.log("Current Time (seconds):", parseInt(Date.now() / 1000));

  //   if (decoded.exp < parseInt(Date.now() / 1000)) {
  //     // Token has expired
  //     console.log("Token expired, navigating to /tokenexpiry");
  //     navigate("/tokenexpiry", { replace: true });
  //     localStorage.removeItem("token");
  //     localStorage.removeItem("userdetails");
  //   } else {
  //     // Token is still valid
  //     console.log("Token is not expired");
  //     return "not Expired";
  //   }
  // } catch (error) {
  //   console.error("Error decoding token:", error.message);
  //   navigate("/login", { replace: true }); // Redirect to login if token is invalid
  // }
// };
