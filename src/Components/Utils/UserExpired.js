import { jwtDecode } from "jwt-decode";

export const GetExpired = (tokenExpiry, navigate) => {
//   const decoded = jwtDecode(tokenExpiry && tokenExpiry);

//   if (decoded.exp < parseInt(Date.now() / 1000)) {
//     // navigate("/tokenexpiry", { replace: true });
//     navigate("/", { replace: true });
//     localStorage.removeItem("token");
//     localStorage.removeItem("userdetails");
//     // setTimeout(() => {
//     // }, 1000);
//   } else {
//     return "not Expired";
//   }
};



// function autoLogoutAtMidnight() {
//   setInterval(() => {
//       let now = new Date();
//       if (now.getHours() === 0 && now.getMinutes() === 0) {
//           logoutUser();
//       }
//   }, 1000); // Har minute check karega
// }

// function logoutUser() {
//   // Yahan aap apne admin panel ke logout logic ko implement karein
//   alert("Aapka session khatam ho gaya hai. Kripya dobara login karein.");
//   localStorage.removeItem("userToken"); // Example: Token hata diya
//   window.location.href = "/login"; // Login page par redirect
// }

// // Function ko call karna na bhoolen
// autoLogoutAtMidnight();
