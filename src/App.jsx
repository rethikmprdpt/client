// import React from "react";
// import { Routes, Route } from "react-router-dom";
// import useApiInterceptor from "./hooks/useApiInterceptor";

// // Layouts & Wrappers
// import Layout from "./components/Layout";
// import ProtectedRoute from "./components/ProtectedRoute";

// // Pages (Views)
// // Make sure these paths are correct for your project
// import LoginPage from "./views/LoginPage";
// import Home from "./views/Home";
// import AssetDashBoard from "./views/pages/AssetDashboard";
// // Import other pages you create here
// // import CustomerOnboarding from './views/CustomerOnboarding';

// export default function App() {
//   // This line activates your API interceptors for all requests.
//   // It must be called from a component inside the <AuthProvider>.
//   useApiInterceptor();

//   return (
//     <Routes>
//       <Route path="/login" element={<LoginPage />} />

//       <Route
//         element={
//           <ProtectedRoute>
//             <Layout />
//           </ProtectedRoute>
//         }
//       >
//         {/* The "home" page (path="/"), which redirects based on role */}
//         <Route path="/" element={<Home />} />

//         {/* <Route path="assets" element={<AssetDashBoard />} /> */}
//       </Route>

//       {/* 3. 404 Not Found Page (Optional but recommended) */}
//       {/* <Route path="*" element={<div>Page Not Found</div>} /> */}
//     </Routes>
//   );
// }

import React from "react";
import { Routes, Route } from "react-router-dom";
import useApiInterceptor from "./hooks/useApiInterceptor";

// Layouts & Wrappers
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleProtected from "./components/RoleProtected"; // 1. Import RoleProtected

// Pages (Views)
// Make sure these paths are correct for your project
import LoginPage from "./views/LoginPage";
import Home from "./views/Home";
import AssetDashBoard from "./views/pages/AssetDashboard";
import CustomerOnboarding from "./views/pages/CustomerOnboarding";
import TasksPage from "./views/pages/TasksDashboard";
import SupportPage from "./views/pages/SupportDashboard";
import AuditPage from "./views/pages/AuditDashboard";

/**
 * The main App component.
 * This is now the central router for your application.
 */
export default function App() {
  // This line activates your API interceptors for all requests.
  useApiInterceptor();

  return (
    <Routes>
      {/* 1. Public Route */}
      <Route path="/login" element={<LoginPage />} />

      {/* 2. Protected Routes (must be logged in) */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        {/* The "home" page (path="/"), which redirects based on role */}
        <Route path="/" element={<Home />} />

        {/* Your 'Home' component might already show AssetDashBoard for 'planner',
          but having a direct route is good for the sidebar link.
        */}
        <Route
          path="assets"
          element={
            <RoleProtected allowedRoles={["Planner"]}>
              <AssetDashBoard />
            </RoleProtected>
          }
        />

        {/* 3. Role-Protected Routes (must be logged in AND have role) */}

        <Route
          path="onboarding"
          element={
            <RoleProtected allowedRoles={["Planner"]}>
              <CustomerOnboarding />
            </RoleProtected>
          }
        />

        <Route
          path="tasks"
          element={
            <RoleProtected allowedRoles={["Planner", "Technician"]}>
              <TasksPage />
            </RoleProtected>
          }
        />

        <Route
          path="support"
          element={
            <RoleProtected allowedRoles={["SupportAgent"]}>
              <SupportPage />
            </RoleProtected>
          }
        />

        <Route
          path="audit"
          element={
            <RoleProtected allowedRoles={["Admin"]}>
              <AuditPage />
            </RoleProtected>
          }
        />
      </Route>

      {/* 4. 404 Not Found Page (Optional but recommended) */}
      {/* <Route path="*" element={<div>Page Not Found</div>} /> */}
    </Routes>
  );
}
