/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutGrid,
  UserPlus,
  ListTodo,
  LifeBuoy,
  ShieldCheck,
} from "lucide-react";

// 1. Define all possible navigation links with their roles
export const allLinks = [
  {
    name: "Dashboard",
    to: "/assets", // Links to your Asset Dashboard
    icon: LayoutGrid,
    roles: ["Planner"],
  },
  {
    name: "Onboarding",
    to: "/onboarding", // You will need to create this page
    icon: UserPlus,
    roles: ["Planner"],
  },
  {
    name: "Tasks",
    to: "/tasks", // You will need to create this page
    icon: ListTodo,
    roles: ["Planner", "Technician"],
  },
  {
    name: "Support",
    to: "/support", // You will need to create this page
    icon: LifeBuoy,
    roles: ["SupportAgent"],
  },
  {
    name: "Audit",
    to: "/audit", // You will need to create this page
    icon: ShieldCheck,
    roles: ["Admin"],
  },
];

// Reusable NavLink item with hover-to-show-text
const SidebarLink = ({ name, to, icon: Icon }) => {
  // This function handles the styling for active/inactive links
  const getClassName = ({ isActive }) =>
    "relative flex items-center justify-center h-12 w-12 group rounded-lg " +
    (isActive
      ? "bg-blue-600 text-white" // Active link
      : "text-gray-500 hover:bg-gray-100"); // Inactive link

  return (
    <li>
      <NavLink to={to} className={getClassName}>
        <Icon size={22} />
        {/* 2. This is the hover-to-show text */}
        <span
          className="
          absolute left-full ml-3 px-3 py-1.5 
          text-sm font-medium text-white bg-gray-900 
          rounded-lg shadow-lg opacity-0 
          invisible group-hover:opacity-100 group-hover:visible
          transition-opacity z-10 whitespace-nowrap"
        >
          {name}
        </span>
      </NavLink>
    </li>
  );
};

// The main Sidebar component
export default function Sidebar({ user }) {
  // 3. Filter the links based on the user's role
  const accessibleLinks = React.useMemo(() => {
    if (!user?.role) return [];
    return allLinks.filter((link) => link.roles.includes(user.role));
  }, [user]);

  if (accessibleLinks.length === 0) {
    // Don't render a sidebar if the user has no sidebar links
    return null;
  }

  return (
    <nav className="flex flex-col flex-shrink-0 items-center w-16 h-screen fixed bg-white border-r border-gray-200 shadow-inner-right">
      <ul className="flex flex-col gap-4 py-4">
        {accessibleLinks.map((link) => (
          <SidebarLink
            key={link.name}
            name={link.name}
            to={link.to}
            icon={link.icon}
          />
        ))}
      </ul>
    </nav>
  );
}
