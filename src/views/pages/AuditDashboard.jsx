import React, { useState, useEffect } from "react";
import { getAuditLogs, exportAuditLogs } from "../../api/auditApi.js";
import { getAllUsers } from "../../api/userApi.js";
import { Loader2, User, Calendar, Database, Download } from "lucide-react"; // Import icons

// // Date filter options
// const dateOptions = [
//   { label: "All Time", value: "" },
//   { label: "Past 24 Hours", value: "1" },
//   { label: "Past 7 Days", value: "7" },
//   { label: "Past 30 Days", value: "30" },
// ];

// // --- Main Audit Log Dashboard Component ---
// const AuditLogDashboard = () => {
//   const [logs, setLogs] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [filters, setFilters] = useState({
//     user_id: "",
//     days_ago: "",
//   });
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");

//   // 1. Fetch all users on component mount (for the filter dropdown)
//   useEffect(() => {
//     getAllUsers()
//       .then((response) => {
//         setUsers(response.data || []);
//       })
//       .catch((error) => {
//         console.error("Failed to fetch users:", error);
//         setError("Failed to load user list for filters.");
//       });
//   }, []); // Run only once on mount

//   // 2. Fetch audit logs whenever filters change
//   useEffect(() => {
//     const fetchLogs = async () => {
//       setIsLoading(true);
//       setError("");
//       try {
//         // Prepare filters: remove empty strings
//         const activeFilters = {};
//         if (filters.user_id) {
//           activeFilters.user_id = filters.user_id;
//         }
//         if (filters.days_ago) {
//           activeFilters.days_ago = filters.days_ago;
//         }

//         const response = await getAuditLogs(activeFilters);
//         setLogs(response.data || []);
//       } catch (error) {
//         console.error("Failed to fetch audit logs:", error);
//         const errorMsg =
//           error.response?.data?.detail || "Could not load audit logs.";
//         setError(errorMsg);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchLogs();
//   }, [filters]); // Re-run whenever filters change

//   // Handle filter dropdown changes
//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilters((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   // Helper to format date
//   const formatTimestamp = (ts) => {
//     return new Date(ts).toLocaleString();
//   };

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen font-inter">
//       <h1 className="text-2xl font-bold text-gray-900 mb-4">
//         Audit Log Dashboard
//       </h1>
//       <p className="text-gray-600 mb-6">
//         View all system actions performed by users.
//       </p>

//       {/* --- Filters Section --- */}
//       <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           {/* User Filter */}
//           <div>
//             <label
//               htmlFor="user_id"
//               className="block text-sm font-medium text-gray-700 mb-1"
//             >
//               Filter by User
//             </label>
//             <div className="relative">
//               <span className="absolute inset-y-0 left-0 flex items-center pl-3">
//                 <User className="h-5 w-5 text-gray-400" />
//               </span>
//               <select
//                 name="user_id"
//                 id="user_id"
//                 value={filters.user_id}
//                 onChange={handleFilterChange}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//               >
//                 <option value="">All Users</option>
//                 {users.map((user) => (
//                   <option key={user.user_id} value={user.user_id}>
//                     {user.user_id} - {user.username} ({user.role})
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           {/* Date Range Filter */}
//           <div>
//             <label
//               htmlFor="days_ago"
//               className="block text-sm font-medium text-gray-700 mb-1"
//             >
//               Filter by Date
//             </label>
//             <div className="relative">
//               <span className="absolute inset-y-0 left-0 flex items-center pl-3">
//                 <Calendar className="h-5 w-5 text-gray-400" />
//               </span>
//               <select
//                 name="days_ago"
//                 id="days_ago"
//                 value={filters.days_ago}
//                 onChange={handleFilterChange}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//               >
//                 {dateOptions.map((option) => (
//                   <option key={option.value} value={option.value}>
//                     {option.label}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* --- Feedback & Loading Area --- */}
//       {error && (
//         <div className="p-4 rounded-md mb-4 bg-red-100 text-red-800">
//           {error}
//         </div>
//       )}

//       {/* --- Audit Log Table --- */}
//       <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th
//                   scope="col"
//                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                 >
//                   Timestamp
//                 </th>
//                 <th
//                   scope="col"
//                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                 >
//                   User
//                 </th>
//                 <th
//                   scope="col"
//                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                 >
//                   Action
//                 </th>
//                 <th
//                   scope="col"
//                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                 >
//                   Description
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {isLoading ? (
//                 <tr>
//                   <td colSpan="4" className="text-center p-10">
//                     <div className="flex justify-center items-center text-gray-500">
//                       <Loader2 className="h-6 w-6 animate-spin mr-3" />
//                       Loading logs...
//                     </div>
//                   </td>
//                 </tr>
//               ) : logs.length === 0 ? (
//                 <tr>
//                   <td colSpan="4" className="text-center p-10">
//                     <div className="flex justify-center items-center text-gray-500">
//                       <Database className="h-6 w-6 mr-3" />
//                       No audit logs found matching your filters.
//                     </div>
//                   </td>
//                 </tr>
//               ) : (
//                 logs.map((log) => (
//                   <tr key={log.log_id}>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                       {formatTimestamp(log.timestamp)}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
//                       {log.user
//                         ? log.user.username
//                         : `(User ID: ${log.user_id})`}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm">
//                       <span
//                         className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                           log.action_type === "CREATE"
//                             ? "bg-green-100 text-green-800"
//                             : log.action_type === "UPDATE"
//                             ? "bg-yellow-100 text-yellow-800"
//                             : log.action_type === "DELETE"
//                             ? "bg-red-100 text-red-800"
//                             : "bg-blue-100 text-blue-800" // READ
//                         }`}
//                       >
//                         {log.action_type}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-normal text-sm text-gray-600 max-w-md">
//                       {log.description}
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AuditLogDashboard;

// Date filter options

const dateOptions = [
  { label: "All Time", value: "" },
  { label: "Past 24 Hours", value: "1" },
  { label: "Past 7 Days", value: "7" },
  { label: "Past 30 Days", value: "30" },
];

// --- Main Audit Log Dashboard Component ---
const AuditLogDashboard = () => {
  const [logs, setLogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({
    user_id: "",
    days_ago: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false); // <-- State for export button
  const [error, setError] = useState("");

  // 1. Fetch all users on component mount (for the filter dropdown)
  useEffect(() => {
    getAllUsers()
      .then((response) => {
        setUsers(response.data || []);
      })
      .catch((error) => {
        console.error("Failed to fetch users:", error);
        setError("Failed to load user list for filters.");
      });
  }, []); // Run only once on mount

  // 2. Fetch audit logs whenever filters change
  useEffect(() => {
    const fetchLogs = async () => {
      setIsLoading(true);
      setError("");
      try {
        // Prepare filters: remove empty strings
        const activeFilters = {};
        if (filters.user_id) {
          activeFilters.user_id = filters.user_id;
        }
        if (filters.days_ago) {
          activeFilters.days_ago = filters.days_ago;
        }

        const response = await getAuditLogs(activeFilters);
        setLogs(response.data || []);
      } catch (error) {
        console.error("Failed to fetch audit logs:", error);
        const errorMsg =
          error.response?.data?.detail || "Could not load audit logs.";
        setError(errorMsg);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogs();
  }, [filters]); // Re-run whenever filters change

  // Handle filter dropdown changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // --- NEW: Handle Export Button Click ---
  const handleExport = async () => {
    setIsExporting(true);
    setError(""); // Clear old errors
    try {
      // Prepare filters: remove empty strings
      const activeFilters = {};
      if (filters.user_id) {
        activeFilters.user_id = filters.user_id;
      }
      if (filters.days_ago) {
        activeFilters.days_ago = filters.days_ago;
      }

      await exportAuditLogs(activeFilters);
      // No feedback needed, download will just start.
    } catch (error) {
      console.error("Export failed:", error);
      setError(error.message || "Failed to export CSV.");
    } finally {
      setIsExporting(false);
    }
  };

  // Helper to format date
  const formatTimestamp = (ts) => {
    return new Date(ts).toLocaleString();
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-inter">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">
        Audit Log Dashboard
      </h1>
      <p className="text-gray-600 mb-6">
        View all system actions performed by users.
      </p>

      {/* --- Filters Section --- */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          {/* User Filter */}
          <div>
            <label
              htmlFor="user_id"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Filter by User
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <User className="h-5 w-5 text-gray-400" />
              </span>
              <select
                name="user_id"
                id="user_id"
                value={filters.user_id}
                onChange={handleFilterChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Users</option>
                {users.map((user) => (
                  <option key={user.user_id} value={user.user_id}>
                    {user.user_id} - {user.username} ({user.role})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date Range Filter */}
          <div>
            <label
              htmlFor="days_ago"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Filter by Date
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Calendar className="h-5 w-5 text-gray-400" />
              </span>
              <select
                name="days_ago"
                id="days_ago"
                value={filters.days_ago}
                onChange={handleFilterChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                {dateOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* --- NEW: Export Button --- */}
          <div>
            <button
              onClick={handleExport}
              disabled={isExporting || isLoading}
              className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white font-medium rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-gray-300"
            >
              {isExporting ? (
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
              ) : (
                <Download className="h-5 w-5 mr-2" />
              )}
              {isExporting ? "Exporting..." : "Export as CSV"}
            </button>
          </div>
        </div>
      </div>

      {/* --- Feedback & Loading Area --- */}
      {error && (
        <div className="p-4 rounded-md mb-4 bg-red-100 text-red-800">
          {error}
        </div>
      )}

      {/* --- Audit Log Table --- */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Timestamp
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  User
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Action
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan="4" className="text-center p-10">
                    <div className="flex justify-center items-center text-gray-500">
                      <Loader2 className="h-6 w-6 animate-spin mr-3" />
                      Loading logs...
                    </div>
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center p-10">
                    <div className="flex justify-center items-center text-gray-500">
                      <Database className="h-6 w-6 mr-3" />
                      No audit logs found matching your filters.
                    </div>
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.log_id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatTimestamp(log.timestamp)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {log.user
                        ? log.user.username
                        : `(User ID: ${log.user_id})`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          log.action_type === "CREATE"
                            ? "bg-green-100 text-green-800"
                            : log.action_type === "UPDATE"
                            ? "bg-yellow-100 text-yellow-800"
                            : log.action_type === "DELETE"
                            ? "bg-red-100 text-red-800"
                            : "bg-blue-100 text-blue-800" // READ
                        }`}
                      >
                        {log.action_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-normal text-sm text-gray-600 max-w-md">
                      {log.description}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuditLogDashboard;
