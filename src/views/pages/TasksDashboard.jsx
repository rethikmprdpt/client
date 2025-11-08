// import React, { useState, useEffect } from "react";
// import { getDeploymentTasksByStatus } from "../../api/deploymentTaskApi.js";

// // --- Card for 'Scheduled', 'InProgress', 'Completed & Failed' tabs ---
// // (Moved from the other file)
// const TaskCard = ({ task }) => {
//   // Guard clauses to prevent crash if customer or user is missing
//   if (!task || !task.customer || !task.user) {
//     return (
//       <div className="bg-white p-4 rounded-lg shadow border border-red-200">
//         <h3 className="text-lg font-semibold text-red-800">Task Data Error</h3>
//         <p className="text-sm text-red-600">
//           Associated customer or user data is missing for this task.
//         </p>
//         <p className="text-xs text-gray-400 mt-2">
//           Task ID: {task?.task_id || "Unknown"}
//         </p>
//       </div>
//     );
//   }

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "Scheduled":
//         return "bg-yellow-100 text-yellow-800";
//       case "InProgress":
//         return "bg-blue-100 text-blue-800";
//       case "Completed":
//         return "bg-green-100 text-green-800";
//       case "Failed":
//         return "bg-red-100 text-red-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   return (
//     <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
//       <div className="flex justify-between items-start">
//         <h3 className="text-lg font-semibold text-gray-800">
//           {task.customer.name}
//         </h3>
//         <span
//           className={`text-xs inline-block rounded-full px-3 py-1 font-medium ${getStatusColor(
//             task.status
//           )}`}
//         >
//           {task.status}
//         </span>
//       </div>
//       <p className="text-sm text-gray-600">
//         {task.customer.address}, {task.customer.pincode}
//       </p>

//       <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
//         <p className="text-sm text-gray-700">
//           <span className="font-medium">Technician:</span> {task.user.username}
//         </p>
//         <p className="text-sm text-gray-700">
//           <span className="font-medium">Scheduled:</span>{" "}
//           {new Date(task.scheduled_date).toLocaleDateString()}
//         </p>
//         {task.notes && (
//           <p className="text-sm text-gray-500 bg-gray-50 p-2 rounded-md">
//             <span className="font-medium">Notes:</span> {task.notes}
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// // --- Main Tasks Dashboard Component ---
// const TasksDashboard = () => {
//   const [activeTab, setActiveTab] = useState("Scheduled"); // Default to 'Scheduled'
//   const [listData, setListData] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [feedback, setFeedback] = useState({ message: "", type: "" });

//   // Define the tabs for this dashboard
//   const tabs = ["Scheduled", "In Progress", "Completed & Failed"];

//   // --- Data Fetching ---
//   const fetchData = async () => {
//     setIsLoading(true);
//     setFeedback({ message: "", type: "" });
//     setListData([]);

//     try {
//       if (activeTab === "Completed & Failed") {
//         // Fetch both completed and failed tasks
//         const [completedRes, failedRes] = await Promise.all([
//           getDeploymentTasksByStatus("Completed"),
//           getDeploymentTasksByStatus("Failed"),
//         ]);
//         setListData([...(completedRes.data || []), ...(failedRes.data || [])]);
//       } else {
//         // Fetch tasks for 'Scheduled' or 'In Progress'
//         const response = await getDeploymentTasksByStatus(activeTab);
//         setListData(response.data || []);
//       }
//     } catch (error) {
//       console.error(`Error fetching ${activeTab} data:`, error);
//       setFeedback({
//         message: `Failed to fetch ${activeTab} data.`,
//         type: "error",
//       });
//       setListData([]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Refetch data when activeTab changes
//   useEffect(() => {
//     fetchData();
//   }, [activeTab]);

//   // --- Render ---
//   return (
//     <div className="p-6 bg-gray-50 min-h-screen font-inter">
//       {/* --- Header --- */}
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-2xl font-bold text-gray-900">Deployment Tasks</h1>
//       </div>

//       {/* --- Global Feedback Message --- */}
//       {feedback.message && (
//         <div
//           className={`p-4 rounded-md mb-4 ${
//             feedback.type === "success"
//               ? "bg-green-100 text-green-800"
//               : "bg-red-100 text-red-800"
//           }`}
//           onClick={() => setFeedback({ message: "", type: "" })}
//         >
//           {feedback.message}
//         </div>
//       )}

//       {/* --- Tabs --- */}
//       <div className="mb-4">
//         <div className="border-b border-gray-200">
//           <nav className="-mb-px flex space-x-6" aria-label="Tabs">
//             {tabs.map((tab) => (
//               <button
//                 key={tab}
//                 onClick={() => setActiveTab(tab)}
//                 className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition ${
//                   activeTab === tab
//                     ? "border-blue-500 text-blue-600"
//                     : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
//                 }`}
//               >
//                 {tab}
//               </button>
//             ))}
//           </nav>
//         </div>
//       </div>

//       {/* --- Content Area --- */}
//       <div className="content-area">
//         {isLoading ? (
//           <div className="text-center p-10">
//             <p className="text-gray-600">Loading...</p>
//           </div>
//         ) : listData.length === 0 ? (
//           <div className="text-center p-10 bg-white rounded-lg shadow-sm">
//             <p className="text-gray-500">{`No tasks ${activeTab.toLowerCase()}.`}</p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {listData
//               .filter((task) => task && task.task_id) // Ensure task and task_id exist
//               .map((task) => (
//                 <TaskCard key={task.task_id} task={task} />
//               ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default TasksDashboard;

import React, { useState, useEffect } from "react";
// Import the new API functions
import {
  getDeploymentTasksByStatus,
  updateTaskChecklist,
} from "../../api/deploymentTaskApi.js";
import { getCustomerProvisioningDetails } from "../../api/customerApi.js";
// Import your auth hook (assuming path)
import { useAuth } from "../../context/authContext.jsx";

// --- Hardcoded text for the checklist ---
const checklistMap = {
  step_1: "Test fiber signal from splitter port",
  step_2: "Connect ONT and check power/light",
  step_3: "Connect router and test LAN/WiFi signal",
};

// --- Task Card Component (Updated) ---
const TaskCard = ({ task, onUpdateClick }) => {
  const { user } = useAuth(); // Get the current user

  const getStatusColor = (status) => {
    switch (status) {
      case "Scheduled":
        return "text-blue-600 bg-blue-100";
      case "InProgress":
        return "text-yellow-600 bg-yellow-100";
      case "Completed":
        return "text-green-600 bg-green-100";
      case "Failed":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-gray-900">
          {task.customer?.name || "Customer Data missing"}
        </h3>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
            task.status
          )}`}
        >
          {task.status}
        </span>
      </div>
      <p className="text-sm text-gray-600 mb-1">
        <span className="font-medium">Technician:</span>{" "}
        {task.user?.username || "N/A"}
      </p>
      <p className="text-sm text-gray-600 mb-1">
        <span className="font-medium">Address:</span>{" "}
        {task.customer?.address || "N/A"}
      </p>
      <p className="text-sm text-gray-600 mb-4">
        <span className="font-medium">Scheduled:</span>{" "}
        {new Date(task.scheduled_date).toLocaleDateString()}
      </p>
      <div className="border-t border-gray-100 pt-4">
        {/* --- THIS IS THE NEW BUTTON --- */}
        {/* Only show this button if the user is a Technician */}
        {user && user.role === "Technician" && task.status !== "Completed" && (
          <button
            onClick={() => onUpdateClick(task)}
            className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {task.status === "Scheduled"
              ? "Start & Update Task"
              : "View/Update Task"}
          </button>
        )}
        {/* Planners will see no button, just the task info */}
      </div>
    </div>
  );
};

// --- NEW: Task Update Modal ---
const TaskUpdateModal = ({ task, onClose, onUpdateSuccess }) => {
  const [details, setDetails] = useState(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const [checklist, setChecklist] = useState({
    step_1: task.step_1 || false,
    step_2: task.step_2 || false,
    step_3: task.step_3 || false,
  });

  // 1. Fetch provisioning details when modal opens
  useEffect(() => {
    if (!task?.customer?.customer_id) {
      setError("Invalid task data.");
      setIsLoadingDetails(false);
      return;
    }

    setIsLoadingDetails(true);
    setError("");

    getCustomerProvisioningDetails(task.customer.customer_id)
      .then((response) => {
        setDetails(response.data);
      })
      .catch((err) => {
        console.error("Failed to fetch provisioning details:", err);
        setError("Failed to load provisioning details. Please try again.");
      })
      .finally(() => {
        setIsLoadingDetails(false);
      });
  }, [task]);

  // 2. Handle checkbox changes
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setChecklist((prev) => ({ ...prev, [name]: checked }));
  };

  // 3. Handle saving the checklist
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");

    try {
      await updateTaskChecklist(task.task_id, checklist);
      onUpdateSuccess(); // Close modal and refresh list
    } catch (err) {
      console.error("Failed to update task:", err);
      const errorMsg =
        err.response?.data?.detail || "An unknown error occurred.";
      setError(`Failed to save: ${errorMsg}`);
      setIsSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl m-4"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Update Task: {task.customer.name}
            </h2>

            {error && (
              <div className="p-3 rounded-md mb-4 bg-red-100 text-red-800 text-sm">
                {error}
              </div>
            )}

            {/* --- Read-only Details Section --- */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-3 border-b pb-2">
                Provisioning Details
              </h3>
              {isLoadingDetails ? (
                <div className="text-center p-4">
                  <p className="text-gray-500">Loading details...</p>
                </div>
              ) : !details ? (
                <div className="text-center p-4">
                  <p className="text-red-500">Could not load details.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                  <p className="text-gray-700">
                    <span className="font-medium text-gray-900">FDH:</span>{" "}
                    {details.port?.splitter?.fdh?.model || "N/A"} (ID:{" "}
                    {details.port?.splitter?.fdh?.fdh_id || "N/A"})
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium text-gray-900">Splitter:</span>{" "}
                    {details.port?.splitter?.model || "N/A"} (ID:{" "}
                    {details.port?.splitter?.splitter_id || "N/A"})
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium text-gray-900">Port ID:</span>{" "}
                    {details.port?.port_id || "N/A"}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium text-gray-900">ONT:</span>{" "}
                    {details.ont_asset?.serial_number || "N/A"} (ID:{" "}
                    {details.ont_asset?.asset_id || "N/A"})
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium text-gray-900">Router:</span>{" "}
                    {details.router_asset?.serial_number || "N/A"} (ID:{" "}
                    {details.router_asset?.asset_id || "N/A"})
                  </p>
                </div>
              )}
            </div>

            {/* --- Checklist Section --- */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-3 border-b pb-2">
                Installation Checklist
              </h3>
              <div className="space-y-3">
                {Object.keys(checklistMap).map((key) => (
                  <label
                    key={key}
                    className="flex items-center p-3 bg-gray-50 rounded-md border border-gray-200"
                  >
                    <input
                      type="checkbox"
                      name={key}
                      checked={checklist[key]}
                      onChange={handleCheckboxChange}
                      className="h-5 w-5 rounded text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-3 text-sm text-gray-700">
                      {checklistMap[key]}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 rounded-b-lg">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving || isLoadingDetails}
              className="px-4 py-2 bg-green-600 text-white rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-green-300"
            >
              {isSaving ? "Saving..." : "Save & Complete"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Main Dashboard Component (Updated) ---
const TasksDashboard = () => {
  const [activeTab, setActiveTab] = useState("Scheduled");
  const [listData, setListData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // --- New Modal State ---
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const tabs = ["Scheduled", "InProgress", "Completed & Failed"];

  const fetchData = async () => {
    setIsLoading(true);
    setError("");
    setListData([]);

    try {
      if (activeTab === "Completed & Failed") {
        const [completedRes, failedRes] = await Promise.all([
          getDeploymentTasksByStatus("Completed"),
          getDeploymentTasksByStatus("Failed"),
        ]);
        setListData([...(completedRes.data || []), ...(failedRes.data || [])]);
      } else {
        const response = await getDeploymentTasksByStatus(activeTab);
        setListData(response.data || []);
      }
    } catch (err) {
      console.error(`Error fetching ${activeTab} data:`, err);
      const errorMsg = err.response?.data?.detail || "Failed to fetch tasks.";
      setError(errorMsg);
      setListData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  // --- Handlers for the new modal ---
  const handleOpenUpdateModal = (task) => {
    setSelectedTask(task);
    setIsUpdateModalOpen(true);
  };

  const handleCloseUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setSelectedTask(null);
  };

  const handleUpdateSuccess = () => {
    handleCloseUpdateModal();
    fetchData(); // Refresh the main list
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-inter">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">
        Deployment Tasks
      </h1>

      {error && (
        <div className="p-4 rounded-md mb-4 bg-red-100 text-red-800">
          {error}
        </div>
      )}

      {/* --- Tabs --- */}
      <div className="mb-4">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.replace("InProgress", "In Progress")}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* --- Content Area --- */}
      <div className="content-area">
        {isLoading ? (
          <div className="text-center p-10">
            <p className="text-gray-500">Loading tasks...</p>
          </div>
        ) : listData.length === 0 ? (
          <div className="text-center p-10 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500">No tasks found for this status.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {listData
              .filter((task) => task && task.task_id) // Add filter for safety
              .map((task) => (
                <TaskCard
                  key={task.task_id}
                  task={task}
                  onUpdateClick={handleOpenUpdateModal} // Pass the handler
                />
              ))}
          </div>
        )}
      </div>

      {/* --- Render the Modal --- */}
      {isUpdateModalOpen && selectedTask && (
        <TaskUpdateModal
          task={selectedTask}
          onClose={handleCloseUpdateModal}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}
    </div>
  );
};

export default TasksDashboard;
