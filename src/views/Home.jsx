// import React from "react";
// import { useAuth } from "../context/authContext";

// // import AdminDashboard from "../views/dashboards/AdminDashboard";
// // import ManagerDashboard from "../views/dashboards/ManagerDashboard";
// import AssetDashBoard from "./pages/AssetDashboard"; // Your existing component
// import LoadingSpinner from "../components/LoadingSpinner";

// /**
//  * This component acts as a "router" based on the user's role.
//  * It's the default page users see when they land at '/'.
//  */
// const Home = () => {
//   const { user } = useAuth();

//   if (!user) {
//     // This should not happen if ProtectedRoute is working,
//     // but it's good practice.
//     return (
//       <div className="flex items-center justify-center h-full">
//         <LoadingSpinner size="lg" />
//       </div>
//     );
//   }

//   // Check the role and render the correct dashboard
//   switch (user.role) {
//     case "Admin":
//       return <AdminDashboard />;
//     case "Manager":
//       return <ManagerDashboard />;
//     default:
//       // Default to your AssetDashboard
//       return <AssetDashBoard />;
//   }
// };

// export default Home;

import React, { useMemo } from "react";
import { useAuth } from "../context/authContext";
import { Navigate } from "react-router-dom";

// 1. Import allLinks from the Sidebar component
import { allLinks } from "../components/Sidebar";

import AssetDashBoard from "../views/pages/AssetDashboard"; // Your fallback component
import LoadingSpinner from "../components/LoadingSpinner";

/**
 * This component acts as a "router" based on the user's role.
 * It's the default page users see when they land at '/'.
 *
 * It now dynamically redirects to the *first* accessible link
 * in the user's sidebar.
 */
const Home = () => {
  const { user } = useAuth();

  // 2. Find the user's first accessible sidebar link
  const firstAccessibleLink = useMemo(() => {
    if (!user?.role) return null;
    // Filter the links just like the sidebar does
    const accessibleLinks = allLinks.filter((link) =>
      link.roles.includes(user.role)
    );
    // Return the first link, or null if there are none
    return accessibleLinks.length > 0 ? accessibleLinks[0] : null;
  }, [user]);

  if (!user) {
    // This should not happen if ProtectedRoute is working,
    // but it's good practice.
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // 3. If a first link is found, redirect to it
  if (firstAccessibleLink) {
    return <Navigate to={firstAccessibleLink.to} replace />;
  }

  // 4. Fallback: If the user has no sidebar links, show a default.
  //    We'll keep your original AssetDashBoard as the default.
  return <AssetDashBoard />;
};

export default Home;
