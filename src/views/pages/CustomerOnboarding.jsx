import React, { useState, useEffect } from "react";
import { onboardCustomer, getCustomersByStatus } from "../../api/customerApi";
import { createDeploymentTask } from "../../api/deploymentTaskApi";
import { getAvailableAssets } from "../../api/assetApi";
import { getAllFdhs, getSplittersForFdh } from "../../api/fdhApi";

import { getTechnicians } from "../../api/userApi";

// // --- Card for 'Pending' tab (Stays in this file) ---
// const CustomerCard = ({ customer, onAssignClick }) => (
//   <div className="bg-white p-4 rounded-lg shadow border border-gray-200 flex flex-col justify-between">
//     <div>
//       <h3 className="text-lg font-semibold text-gray-800">{customer.name}</h3>
//       <p className="text-sm text-gray-600">
//         {customer.address}, {customer.pincode}
//       </p>
//       <div className="mt-2 pt-2 border-t border-gray-100">
//         <span className="text-xs inline-block bg-blue-100 text-blue-800 rounded-full px-3 py-1 font-medium">
//           Plan: {customer.plan}
//         </span>
//       </div>
//     </div>
//     <button
//       onClick={() => onAssignClick(customer)}
//       className="mt-4 w-full px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition"
//     >
//       Assign Technician
//     </button>
//   </div>
// );

// // --- Assign Technician Modal (Stays in this file) ---
// const AssignTaskModal = ({
//   customer,
//   onClose,
//   onAssignSuccess,
//   feedback,
//   setFeedback,
// }) => {
//   const [formData, setFormData] = useState({
//     userId: "",
//     scheduledDate: "",
//     notes: "",
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // --- NEW: State for technician list and loading ---
//   const [technicians, setTechnicians] = useState([]);
//   const [isLoadingTechs, setIsLoadingTechs] = useState(false);

//   // --- NEW: Fetch technicians when the modal opens (customer prop changes) ---
//   useEffect(() => {
//     if (customer) {
//       setIsLoadingTechs(true);
//       setFeedback({ message: "", type: "" }); // Clear old errors

//       getTechnicians()
//         .then((response) => {
//           setTechnicians(response.data || []);
//         })
//         .catch((error) => {
//           console.error("Failed to fetch technicians:", error);
//           setFeedback({
//             message: "Failed to load technicians. Please try again.",
//             type: "error",
//           });
//         })
//         .finally(() => {
//           setIsLoadingTechs(false);
//         });
//     }
//   }, [customer, setFeedback]); // Re-run when the customer (modal) changes

//   const handleFormChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setFeedback({ message: "", type: "" });

//     try {
//       // --- FIX: Manually construct the payload ---
//       // This ensures we send snake_case ('scheduled_date')
//       // instead of camelCase ('scheduledDate')
//       const taskData = {
//         customer_id: customer.customer_id,
//         user_id: parseInt(formData.userId, 10),
//         scheduled_date: formData.scheduledDate, // Map from form
//         notes: formData.notes, // Map from form
//       };

//       await createDeploymentTask(taskData);
//       setFeedback({ message: "Task successfully assigned!", type: "success" });
//       onAssignSuccess(); // This will close modal and refresh lists
//     } catch (error) {
//       console.error("Failed to assign task:", error);
//       const errorMsg =
//         error.response?.data?.detail[0]?.msg ||
//         error.response?.data?.detail ||
//         "An unknown error occurred.";
//       setFeedback({ message: `Error: ${errorMsg}`, type: "error" });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity">
//       <div
//         className="bg-white rounded-lg shadow-xl w-full max-w-lg m-4"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <form onSubmit={handleSubmit}>
//           <div className="p-6">
//             <h2 className="text-xl font-semibold text-gray-900 mb-1">
//               Assign Task for:
//             </h2>
//             <p className="text-lg text-blue-600 mb-4">{customer.name}</p>

//             {feedback.message && feedback.type === "error" && (
//               <div className="p-3 rounded-md mb-4 bg-red-100 text-red-800 text-sm">
//                 {feedback.message}
//               </div>
//             )}

//             <div className="space-y-4">
//               <div>
//                 <label
//                   htmlFor="userId"
//                   className="block text-sm font-medium text-gray-700 mb-1"
//                 >
//                   Technician
//                 </label>
//                 {/* --- UPDATED: Technician Dropdown --- */}
//                 <select
//                   name="userId"
//                   id="userId"
//                   value={formData.userId}
//                   onChange={handleFormChange}
//                   required
//                   disabled={isLoadingTechs}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
//                 >
//                   <option value="" disabled>
//                     {isLoadingTechs
//                       ? "Loading technicians..."
//                       : "Select a technician"}
//                   </option>
//                   {!isLoadingTechs &&
//                     technicians.map((tech) => (
//                       <option key={tech.user_id} value={tech.user_id}>
//                         {tech.user_id} - {tech.username}
//                       </option>
//                     ))}
//                 </select>
//               </div>
//               <div>
//                 <label
//                   htmlFor="scheduledDate"
//                   className="block text-sm font-medium text-gray-700 mb-1"
//                 >
//                   Scheduled Date
//                 </label>
//                 <input
//                   type="date"
//                   name="scheduledDate"
//                   id="scheduledDate"
//                   value={formData.scheduledDate}
//                   onChange={handleFormChange}
//                   required
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </div>
//               <div>
//                 <label
//                   htmlFor="notes"
//                   className="block text-sm font-medium text-gray-700 mb-1"
//                 >
//                   Notes (Optional)
//                 </label>
//                 <textarea
//                   name="notes"
//                   id="notes"
//                   rows="3"
//                   value={formData.notes}
//                   onChange={handleFormChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 rounded-b-lg">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={isSubmitting || isLoadingTechs}
//               className="px-4 py-2 bg-green-600 text-white rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-green-300"
//             >
//               {isSubmitting ? "Assigning..." : "Assign Task"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// // --- Main Dashboard Component ---
// const OnboardingDashboard = () => {
//   const [isOnboardModalOpen, setIsOnboardModalOpen] = useState(false);
//   const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
//   const [selectedCustomer, setSelectedCustomer] = useState(null); // For the assign modal

//   const [listData, setListData] = useState([]); // Only pending customers
//   const [isLoading, setIsLoading] = useState(false);
//   const [feedback, setFeedback] = useState({ message: "", type: "" }); // For general/onboard feedback
//   const [assignFeedback, setAssignFeedback] = useState({
//     message: "",
//     type: "",
//   }); // For assign modal

//   const [onboardFormData, setOnboardFormData] = useState({
//     name: "",
//     address: "",
//     pincode: "",
//     plan: "",
//   });

//   // --- REMOVED: tabs array ---

//   // --- Data Fetching (Simplified) ---
//   const fetchData = async () => {
//     setIsLoading(true);
//     // setFeedback({ message: '', type: '' }); // Don't clear feedback
//     setListData([]);

//     try {
//       // --- SIMPLIFIED: Only fetch Pending customers ---
//       const response = await getCustomersByStatus("Pending");
//       setListData(response.data || []);
//     } catch (error) {
//       console.error(`Error fetching Pending data:`, error);
//       setFeedback({
//         message: `Failed to fetch pending customers.`,
//         type: "error",
//       });
//       setListData([]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Fetch data on component mount
//   useEffect(() => {
//     fetchData();
//   }, []); // --- REMOVED: activeTab dependency ---

//   // --- Event Handlers ---
//   const handleOpenOnboardModal = () => {
//     setOnboardFormData({ name: "", address: "", pincode: "", plan: "" });
//     setFeedback({ message: "", type: "" }); // Clear main feedback
//     setIsOnboardModalOpen(true);
//   };

//   const handleCloseOnboardModal = () => {
//     setIsOnboardModalOpen(false);
//   };

//   const handleOpenAssignModal = (customer) => {
//     setSelectedCustomer(customer);
//     setAssignFeedback({ message: "", type: "" }); // Clear assign modal feedback
//     setIsAssignModalOpen(true);
//   };

//   const handleCloseAssignModal = () => {
//     setIsAssignModalOpen(false);
//     setSelectedCustomer(null);
//   };

//   const handleOnboardFormChange = (e) => {
//     const { name, value } = e.target;
//     setOnboardFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleOnboardSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true); // Use main loader
//     setFeedback({ message: "", type: "" });

//     try {
//       await onboardCustomer(onboardFormData);
//       setFeedback({
//         message: "Customer successfully onboarded!",
//         type: "success",
//       });
//       handleCloseOnboardModal();

//       // --- SIMPLIFIED: Just refetch the pending list ---
//       fetchData();
//     } catch (error) {
//       console.error("Failed to onboard customer:", error);
//       const errorMsg =
//         error.response?.data?.detail || "An unknown error occurred.";
//       setFeedback({ message: `Error: ${errorMsg}`, type: "error" });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleAssignSuccess = () => {
//     handleCloseAssignModal();
//     // --- MODIFIED ---
//     // Instead of switching tabs, just show success and refresh the pending list.
//     // The newly assigned task will disappear from this component.
//     setFeedback({
//       message:
//         'Task successfully assigned! It is now in the "Scheduled" queue.',
//       type: "success",
//     });
//     fetchData(); // Refetch the pending list
//   };

//   // --- Render ---
//   return (
//     <div className="p-6 bg-gray-50 min-h-screen font-inter">
//       {/* --- Header & Onboard Button --- */}
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-2xl font-bold text-gray-900">
//           Customer Onboarding
//         </h1>
//         <button
//           onClick={handleOpenOnboardModal}
//           className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
//         >
//           + Onboard Customer
//         </button>
//       </div>

//       {/* --- Global Feedback Message --- */}
//       {feedback.message && (
//         <div
//           className={`p-4 rounded-md mb-4 ${
//             feedback.type === "success"
//               ? "bg-green-100 text-green-800"
//               : "bg-red-100 text-red-800"
//           }`}
//           // Clear feedback on click
//           onClick={() => setFeedback({ message: "", type: "" })}
//         >
//           {feedback.message}
//         </div>
//       )}

//       {/* --- Tabs (Simplified) --- */}
//       <div className="mb-4">
//         <div className="border-b border-gray-200">
//           <nav className="-mb-px flex space-x-6" aria-label="Tabs">
//             {/* --- MODIFIED: Hardcoded "Pending" tab --- */}
//             <span className="whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm border-blue-500 text-blue-600">
//               Pending
//             </span>
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
//             <p className="text-gray-500">No pending customers.</p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {/* --- SIMPLIFIED: Always render CustomerCard --- */}
//             {listData.map((customer) => (
//               <CustomerCard
//                 key={customer.customer_id}
//                 customer={customer}
//                 onAssignClick={handleOpenAssignModal}
//               />
//             ))}
//           </div>
//         )}
//       </div>

//       {/* --- Onboard Customer Modal --- */}
//       {isOnboardModalOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity">
//           <div
//             className="bg-white rounded-lg shadow-xl w-full max-w-lg m-4"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <form onSubmit={handleOnboardSubmit}>
//               <div className="p-6">
//                 <h2 className="text-xl font-semibold text-gray-900 mb-4">
//                   Onboard New Customer
//                 </h2>

//                 {feedback.message && feedback.type === "error" && (
//                   <div className="p-3 rounded-md mb-4 bg-red-100 text-red-800 text-sm">
//                     {feedback.message}
//                   </div>
//                 )}

//                 <div className="space-y-4">
//                   {/* Form fields: name, address, pincode, plan */}
//                   <div>
//                     <label
//                       htmlFor="name"
//                       className="block text-sm font-medium text-gray-700 mb-1"
//                     >
//                       Name
//                     </label>
//                     <input
//                       type="text"
//                       name="name"
//                       id="name"
//                       value={onboardFormData.name}
//                       onChange={handleOnboardFormChange}
//                       required
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                     />
//                   </div>
//                   <div>
//                     <label
//                       htmlFor="address"
//                       className="block text-sm font-medium text-gray-700 mb-1"
//                     >
//                       Address
//                     </label>
//                     <input
//                       type="text"
//                       name="address"
//                       id="address"
//                       value={onboardFormData.address}
//                       onChange={handleOnboardFormChange}
//                       required
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                     />
//                   </div>
//                   <div>
//                     {/* --- FIX: Typo font-column -> font-medium --- */}
//                     <label
//                       htmlFor="pincode"
//                       className="block text-sm font-medium text-gray-700 mb-1"
//                     >
//                       Pincode
//                     </label>
//                     <input
//                       type="text"
//                       name="pincode"
//                       id="pincode"
//                       value={onboardFormData.pincode}
//                       onChange={handleOnboardFormChange}
//                       required
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                     />
//                   </div>
//                   <div>
//                     <label
//                       htmlFor="plan"
//                       className="block text-sm font-medium text-gray-700 mb-1"
//                     >
//                       Plan
//                     </label>

//                     <input
//                       type="text"
//                       name="plan"
//                       id="plan"
//                       value={onboardFormData.plan}
//                       onChange={handleOnboardFormChange}
//                       required
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                     />
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 rounded-b-lg">
//                 <button
//                   type="button"
//                   onClick={handleCloseOnboardModal}
//                   className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={isLoading}
//                   className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300"
//                 >
//                   {isLoading ? "Submitting..." : "Submit"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* --- Assign Task Modal --- */}
//       {isAssignModalOpen && selectedCustomer && (
//         <AssignTaskModal
//           customer={selectedCustomer}
//           onClose={handleCloseAssignModal}
//           onAssignSuccess={handleAssignSuccess}
//           feedback={assignFeedback}
//           setFeedback={setAssignFeedback}
//         />
//       )}
//     </div>
//   );
// };

// export default OnboardingDashboard;

// --- (Existing) Card for 'Pending' tab ---

const CustomerCard = ({ customer, onAssignClick }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
    <div className="p-5">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {customer.name}
      </h3>
      <p className="text-sm text-gray-600 mb-1">
        <strong>Plan:</strong> {customer.plan}
      </p>
      <p className="text-sm text-gray-600 mb-1">
        <strong>Address:</strong> {customer.address}
      </p>
      <p className="text-sm text-gray-600 mb-3">
        <strong>Pincode:</strong> {customer.pincode}
      </p>
      <p className="text-xs text-gray-400">
        Created: {new Date(customer.created_at).toLocaleDateString()}
      </p>
    </div>
    <div className="bg-gray-50 px-5 py-3">
      <button
        onClick={() => onAssignClick(customer)}
        className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Assign Technician
      </button>
    </div>
  </div>
);

// --- (Existing) Assign Technician Modal ---
const AssignTaskModal = ({
  customer,
  onClose,
  onAssignSuccess,
  feedback,
  setFeedback,
}) => {
  const [formData, setFormData] = useState({
    userId: "",
    scheduledDate: "",
    notes: "",
  });
  const [technicians, setTechnicians] = useState([]);
  const [isLoadingTechs, setIsLoadingTechs] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch technicians when modal opens
  useEffect(() => {
    const fetchTechs = async () => {
      setIsLoadingTechs(true);
      setFeedback({ message: "", type: "" });
      try {
        const response = await getTechnicians();
        setTechnicians(response.data || []);
      } catch (error) {
        console.error("Failed to fetch technicians:", error);
        setFeedback({
          message: "Failed to load technicians list.",
          type: "error",
        });
      } finally {
        setIsLoadingTechs(false);
      }
    };
    fetchTechs();
  }, [setFeedback]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.userId || !formData.scheduledDate) {
      setFeedback({
        message: "Please select a technician and a date.",
        type: "error",
      });
      return;
    }

    setIsSubmitting(true);
    setFeedback({ message: "", type: "" });

    const taskData = {
      customer_id: customer.customer_id,
      user_id: parseInt(formData.userId, 10),
      scheduled_date: formData.scheduledDate, // This is a 'date' string
      notes: formData.notes,
    };

    try {
      await createDeploymentTask(taskData);
      onAssignSuccess(); // This will close modal and refresh list
    } catch (error) {
      console.error("Failed to assign task:", error);
      const errorMsg =
        error.response?.data?.detail || "An unknown error occurred.";
      setFeedback({
        message: `Failed to assign task: ${errorMsg}`,
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4 transition-opacity duration-300">
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-lg m-4"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Assign Task
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Assign a technician to{" "}
              <span className="font-medium text-blue-600">{customer.name}</span>
              .
            </p>

            {feedback.message && (
              <div
                className={`p-3 rounded-md mb-4 text-sm ${
                  feedback.type === "error"
                    ? "bg-red-100 text-red-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {feedback.message}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="userId"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Technician
                </label>
                <select
                  name="userId"
                  id="userId"
                  value={formData.userId}
                  onChange={handleFormChange}
                  required
                  disabled={isLoadingTechs}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                >
                  <option value="">
                    {isLoadingTechs ? "Loading..." : "Select a technician"}
                  </option>
                  {!isLoadingTechs &&
                    technicians.map((tech) => (
                      <option key={tech.user_id} value={tech.user_id}>
                        {tech.user_id} - {tech.username}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="scheduledDate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Scheduled Date
                </label>
                <input
                  type="date"
                  name="scheduledDate"
                  id="scheduledDate"
                  value={formData.scheduledDate}
                  onChange={handleFormChange}
                  required
                  min={new Date().toISOString().split("T")[0]} // Set min date to today
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="notes"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Notes (Optional)
                </label>
                <textarea
                  name="notes"
                  id="notes"
                  rows="3"
                  value={formData.notes}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:ring-blue-500"
                />
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
              disabled={isSubmitting || isLoadingTechs}
              className="px-4 py-2 bg-green-600 text-white rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-green-300"
            >
              {isSubmitting ? "Assigning..." : "Assign Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- *** NEW *** Onboard Customer Modal ---
// This is the new, complex modal for customer onboarding and provisioning
const OnboardCustomerModal = ({ isOpen, onClose, onOnboardSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    pincode: "",
    plan: "",
    fdh_id: "",
    splitter_id: "",
    ont_asset_id: "",
    router_asset_id: "",
  });

  const [dropdowns, setDropdowns] = useState({
    fdhs: [],
    splitters: [],
    onts: [],
    routers: [],
  });

  const [loading, setLoading] = useState({
    initial: false,
    splitters: false,
    submit: false,
  });

  const [feedback, setFeedback] = useState({ message: "", type: "" });

  // --- Data Fetching Effects ---

  // Effect 1: Load initial data (FDHs, ONTs, Routers) when modal opens
  useEffect(() => {
    if (isOpen) {
      const loadInitialData = async () => {
        setLoading((prev) => ({ ...prev, initial: true }));
        setFeedback({ message: "", type: "" });
        try {
          const [fdhRes, ontRes, routerRes] = await Promise.all([
            getAllFdhs(),
            getAvailableAssets("ONT"),
            getAvailableAssets("Router"),
          ]);

          setDropdowns((prev) => ({
            ...prev,
            fdhs: fdhRes.data || [],
            onts: ontRes.data || [],
            routers: routerRes.data || [],
          }));
        } catch (error) {
          console.error("Failed to load initial data:", error);
          setFeedback({
            message: "Failed to load required data. Please try again.",
            type: "error",
          });
        } finally {
          setLoading((prev) => ({ ...prev, initial: false }));
        }
      };
      loadInitialData();
    }
  }, [isOpen]); // Only run when modal is opened

  // Effect 2: Load splitters when an FDH is selected
  useEffect(() => {
    if (formData.fdh_id) {
      const loadSplitters = async () => {
        setLoading((prev) => ({ ...prev, splitters: true }));
        setFeedback({ message: "", type: "" });
        try {
          // We only fetch splitters with open ports
          const response = await getSplittersForFdh(formData.fdh_id);
          setDropdowns((prev) => ({ ...prev, splitters: response.data || [] }));
        } catch (error) {
          console.error("Failed to load splitters:", error);
          setFeedback({
            message: "Failed to load splitters for this FDH.",
            type: "error",
          });
        } finally {
          setLoading((prev) => ({ ...prev, splitters: false }));
        }
      };
      loadSplitters();
    }
  }, [formData.fdh_id]); // Run when fdh_id changes

  // --- Handlers ---

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // If user changes FDH, reset the splitter selection
    if (name === "fdh_id") {
      setFormData((prev) => ({ ...prev, splitter_id: "" }));
      setDropdowns((prev) => ({ ...prev, splitters: [] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading((prev) => ({ ...prev, submit: true }));
    setFeedback({ message: "", type: "" });

    // Convert string IDs to numbers
    const submissionData = {
      ...formData,
      splitter_id: parseInt(formData.splitter_id, 10),
      ont_asset_id: parseInt(formData.ont_asset_id, 10),
      router_asset_id: parseInt(formData.router_asset_id, 10),
    };

    try {
      await onboardCustomer(submissionData);
      onOnboardSuccess(); // This will close the modal and refresh the parent list
    } catch (error) {
      console.error("Failed to onboard customer:", error);
      const errorMsg =
        error.response?.data?.detail || "An unknown error occurred.";
      setFeedback({ message: `Error: ${errorMsg}`, type: "error" });
    } finally {
      setLoading((prev) => ({ ...prev, submit: false }));
    }
  };

  if (!isOpen) return null; // Don't render if not open

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4 transition-opacity duration-300">
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl m-4 max-h-[90vh] overflow-y-auto" // Taller modal
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 z-10">
            <h2 className="text-xl font-semibold text-gray-900">
              Onboard & Provision Customer
            </h2>
          </div>

          <div className="p-6">
            {/* Feedback Area */}
            {feedback.message && (
              <div
                className={`p-3 rounded-md mb-4 text-sm ${
                  feedback.type === "error"
                    ? "bg-red-100 text-red-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {feedback.message}
              </div>
            )}

            {/* Form is divided into sections */}
            <div className="space-y-6">
              {/* Section 1: Customer Details */}
              <fieldset>
                <legend className="text-lg font-medium text-gray-900 mb-3">
                  Customer Details
                </legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="plan"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Plan
                    </label>
                    <input
                      type="text"
                      name="plan"
                      id="plan"
                      value={formData.plan}
                      onChange={handleFormChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label
                      htmlFor="address"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      id="address"
                      value={formData.address}
                      onChange={handleFormChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="pincode"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Pincode
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      id="pincode"
                      value={formData.pincode}
                      onChange={handleFormChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </fieldset>

              {/* Section 2: Port Provisioning */}
              <fieldset className="border-t border-gray-200 pt-6">
                <legend className="text-lg font-medium text-gray-900 mb-3">
                  Port Provisioning
                </legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="fdh_id"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      FDH (Hub)
                    </label>
                    <select
                      name="fdh_id"
                      id="fdh_id"
                      value={formData.fdh_id}
                      onChange={handleFormChange}
                      required
                      disabled={loading.initial}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                    >
                      <option value="">
                        {loading.initial ? "Loading FDHs..." : "Select an FDH"}
                      </option>
                      {dropdowns.fdhs.map((fdh) => (
                        <option key={fdh.fdh_id} value={fdh.fdh_id}>
                          ID: {fdh.fdh_id} - {fdh.model} (Pincode: {fdh.pincode}
                          )
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="splitter_id"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Splitter (with free ports)
                    </label>
                    <select
                      name="splitter_id"
                      id="splitter_id"
                      value={formData.splitter_id}
                      onChange={handleFormChange}
                      required
                      disabled={!formData.fdh_id || loading.splitters}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                    >
                      <option value="">
                        {!formData.fdh_id
                          ? "Select an FDH first"
                          : loading.splitters
                          ? "Loading splitters..."
                          : dropdowns.splitters.length === 0
                          ? "No available splitters"
                          : "Select a splitter"}
                      </option>
                      {dropdowns.splitters.map((splitter) => (
                        <option
                          key={splitter.splitter_id}
                          value={splitter.splitter_id}
                        >
                          ID: {splitter.splitter_id} - {splitter.model} (
                          {splitter.max_ports - splitter.used_ports} free)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </fieldset>

              {/* Section 3: Asset Assignment */}
              <fieldset className="border-t border-gray-200 pt-6">
                <legend className="text-lg font-medium text-gray-900 mb-3">
                  Asset Assignment
                </legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="ont_asset_id"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      ONT (Modem)
                    </label>
                    <select
                      name="ont_asset_id"
                      id="ont_asset_id"
                      value={formData.ont_asset_id}
                      onChange={handleFormChange}
                      required
                      disabled={loading.initial}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                    >
                      <option value="">
                        {loading.initial ? "Loading ONTs..." : "Select an ONT"}
                      </option>
                      {dropdowns.onts.map((ont) => (
                        <option key={ont.asset_id} value={ont.asset_id}>
                          {ont.model} (SN: {ont.serial_number})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="router_asset_id"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Router
                    </label>
                    <select
                      name="router_asset_id"
                      id="router_asset_id"
                      value={formData.router_asset_id}
                      onChange={handleFormChange}
                      required
                      disabled={loading.initial}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                    >
                      <option value="">
                        {loading.initial
                          ? "Loading Routers..."
                          : "Select a Router"}
                      </option>
                      {dropdowns.routers.map((router) => (
                        <option key={router.asset_id} value={router.asset_id}>
                          {router.model} (SN: {router.serial_number})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </fieldset>
            </div>
          </div>

          {/* Footer / Actions */}
          <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex justify-end space-x-3 rounded-b-lg border-t border-gray-200 z-10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading.initial || loading.splitters || loading.submit}
              className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300"
            >
              {loading.submit ? "Onboarding..." : "Onboard Customer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- *** MODIFIED *** Main Onboarding Component ---
const CustomerOnboarding = () => {
  // --- Simplified State ---
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isOnboardModalOpen, setIsOnboardModalOpen] = useState(false); // State for new modal
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [listData, setListData] = useState([]); // Only pending customers
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState({ message: "", type: "" });
  const [assignFeedback, setAssignFeedback] = useState({
    message: "",
    type: "",
  });

  // Data Fetching (Unchanged, only fetches Pending)
  const fetchData = async () => {
    setIsLoading(true);
    // setFeedback({ message: '', type: '' }); // Don't clear feedback
    setListData([]);
    try {
      const response = await getCustomersByStatus("Pending");
      setListData(response.data || []);
    } catch (error) {
      console.error(`Error fetching Pending data:`, error);
      setFeedback({
        message: `Failed to fetch pending customers.`,
        type: "error",
      });
      setListData([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // --- Handlers for both modals ---

  const handleOpenAssignModal = (customer) => {
    setSelectedCustomer(customer);
    setIsAssignModalOpen(true);
    setAssignFeedback({ message: "", type: "" });
  };

  const handleCloseAssignModal = () => {
    setIsAssignModalOpen(false);
    setSelectedCustomer(null);
  };

  const handleAssignSuccess = () => {
    handleCloseAssignModal();
    setFeedback({
      message:
        'Task successfully assigned! It is now in the "Scheduled" queue.',
      type: "success",
    });
    fetchData(); // Refetch the pending list
  };

  // --- NEW Handlers for Onboard Modal ---
  const handleOpenOnboardModal = () => {
    setIsOnboardModalOpen(true);
    // Clear global feedback when opening modal
    setFeedback({ message: "", type: "" });
  };

  const handleCloseOnboardModal = () => {
    setIsOnboardModalOpen(false);
  };

  const handleOnboardSuccess = () => {
    handleCloseOnboardModal();
    setFeedback({
      message: "Customer successfully onboarded and provisioned!",
      type: "success",
    });
    fetchData(); // Refetch pending list
  };

  // --- Render ---
  return (
    <div className="p-6 bg-gray-50 min-h-screen font-inter">
      {/* Header & Onboard Button */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-900">
          Customer Onboarding
        </h1>
        <button
          onClick={handleOpenOnboardModal} // <-- Updated
          className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          + Onboard Customer
        </button>
      </div>

      {/* Global Feedback Message */}
      {feedback.message && (
        <div
          className={`p-4 rounded-md mb-4 ${
            feedback.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
          onClick={() => setFeedback({ message: "", type: "" })}
        >
          {feedback.message}
        </div>
      )}

      {/* Hardcoded "Pending" Tab */}
      <div className="mb-4">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-6" aria-label="Tabs">
            <span className="whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm border-blue-500 text-blue-600">
              Pending
            </span>
          </nav>
        </div>
      </div>

      {/* Content Area */}
      <div className="content-area">
        {isLoading ? (
          <div className="text-center p-10">
            <p className="text-gray-500">Loading pending customers...</p>
          </div>
        ) : listData.length === 0 ? (
          <div className="text-center p-10 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500">No pending customers.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {listData.map((customer) => (
              <CustomerCard
                key={customer.customer_id}
                customer={customer}
                onAssignClick={handleOpenAssignModal}
              />
            ))}
          </div>
        )}
      </div>

      {/* --- MODIFIED: Render Modals --- */}

      {/* New Onboard/Provision Modal */}
      <OnboardCustomerModal
        isOpen={isOnboardModalOpen}
        onClose={handleCloseOnboardModal}
        onOnboardSuccess={handleOnboardSuccess}
      />

      {/* Existing Assign Task Modal */}
      {isAssignModalOpen && selectedCustomer && (
        <AssignTaskModal
          customer={selectedCustomer}
          onClose={handleCloseAssignModal}
          onAssignSuccess={handleAssignSuccess}
          feedback={assignFeedback}
          setFeedback={setAssignFeedback}
        />
      )}
    </div>
  );
};

export default CustomerOnboarding;
