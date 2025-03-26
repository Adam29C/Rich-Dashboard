import { jwtDecode } from "jwt-decode";

export const GetExpired = (tokenExpiry, navigate) => {
  const decoded = jwtDecode(tokenExpiry && tokenExpiry);

  if (decoded.exp < parseInt(Date.now() / 1000)) {
    // navigate("/tokenexpiry", { replace: true });
    navigate("/", { replace: true });
    localStorage.removeItem("token");
    localStorage.removeItem("userdetails");
    // setTimeout(() => {
    // }, 1000);
  } else {
    return "not Expired";
  }
};
