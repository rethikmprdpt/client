// import { useState, useEffect } from "react";
// import ConfirmationModal from "./ConfirmationModal";
// import {
//   X,
//   UploadCloud,
//   FileText,
//   Trash2,
//   ChevronLeft,
//   ChevronRight,
//   PlusCircle,
// } from "lucide-react";

// // ... (OntRouterForm component is unchanged) ...
// function OntRouterForm({ formData, setFormData }) {
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   return (
//     <div className="space-y-4">
//       <div>
//         <label
//           htmlFor="model"
//           className="block text-sm font-medium text-gray-700 mb-1"
//         >
//           Model
//         </label>
//         <input
//           type="text"
//           id="model"
//           name="model"
//           value={formData.model}
//           onChange={handleChange}
//           className="w-full text-sm border-gray-300 rounded-lg"
//           placeholder="e.g., Nokia G-140W-C"
//         />
//       </div>
//       <div>
//         <label
//           htmlFor="serial"
//           className="block text-sm font-medium text-gray-700 mb-1"
//         >
//           Serial Number
//         </label>
//         <input
//           type="text"
//           id="serial"
//           name="serial"
//           value={formData.serial}
//           onChange={handleChange}
//           className="w-full text-sm border-gray-300 rounded-lg"
//           placeholder="e.g., NK12345678"
//         />
//       </div>
//     </div>
//   );
// }
// // ... (SplitterForm component is unchanged from the version where it adds ONE splitter) ...
// function SplitterForm({ formData, setFormData }) {
//   const ratios = ["1:8", "1:16", "1:32", "1:64"];

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   return (
//     <div className="space-y-4">
//       <div>
//         <label
//           htmlFor="model"
//           className="block text-sm font-medium text-gray-700 mb-1"
//         >
//           Model
//         </label>
//         <input
//           type="text"
//           id="model"
//           name="model"
//           value={formData.model}
//           onChange={handleChange}
//           className="w-full text-sm border-gray-300 rounded-lg"
//           placeholder="e.g., 1:8 Passive"
//         />
//       </div>
//       <div>
//         <label
//           htmlFor="serial"
//           className="block text-sm font-medium text-gray-700 mb-1"
//         >
//           Serial Number
//         </label>
//         <input
//           type="text"
//           id="serial"
//           name="serial"
//           value={formData.serial}
//           onChange={handleChange}
//           className="w-full text-sm border-gray-300 rounded-lg"
//           placeholder="e.g., SPL12345"
//         />
//       </div>
//       <div className="space-y-2 pt-2">
//         <label className="block text-sm font-medium text-gray-700">
//           Select Splitter Ratio
//         </label>
//         <div className="flex flex-wrap gap-3">
//           {ratios.map((ratio) => (
//             <button
//               key={ratio}
//               type="button"
//               onClick={() => setFormData((prev) => ({ ...prev, ratio }))}
//               className={`px-4 py-2 rounded-lg text-sm font-semibold ${
//                 formData.ratio === ratio
//                   ? "bg-blue-600 text-white"
//                   : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//               }`}
//             >
//               {ratio}
//             </button>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// // --- REBUILT: Form for FDH (Assign Existing Splitters) ---
// function FdhForm({ formData, setFormData, availableSplitters }) {
//   const [splitterToAdd, setSplitterToAdd] = useState(""); // Holds the ID of splitter in dropdown

//   const handleBaseChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   // Find which splitters are *not* yet selected
//   const selectedIds = formData.selectedSplitters;
//   const remainingSplitters = availableSplitters.filter(
//     (s) => !selectedIds.includes(s.splitter_id)
//   );

//   // Get the full objects for the selected splitters
//   const selectedSplittersList = formData.selectedSplitters
//     .map((id) => availableSplitters.find((s) => s.splitter_id === id))
//     .filter(Boolean); // filter(Boolean) removes any undefined

//   // Calculate ports
//   const totalPorts = selectedSplittersList.reduce(
//     (acc, s) => acc + s.max_ports,
//     0
//   );

//   const handleAddSplitter = () => {
//     if (!splitterToAdd) return;
//     setFormData((prev) => ({
//       ...prev,
//       selectedSplitters: [...prev.selectedSplitters, parseInt(splitterToAdd)],
//     }));
//     setSplitterToAdd(""); // Reset dropdown
//   };

//   const handleRemoveSplitter = (idToRemove) => {
//     setFormData((prev) => ({
//       ...prev,
//       selectedSplitters: prev.selectedSplitters.filter(
//         (id) => id !== idToRemove
//       ),
//     }));
//   };

//   return (
//     <div className="space-y-4">
//       {/* FDH Base Fields */}
//       <div>
//         <label
//           htmlFor="model"
//           className="block text-sm font-medium text-gray-700 mb-1"
//         >
//           Model
//         </label>
//         <input
//           type="text"
//           id="model"
//           name="model"
//           value={formData.model}
//           onChange={handleBaseChange}
//           className="w-full text-sm border-gray-300 rounded-lg"
//           placeholder="e.g., Nokia FX-8"
//         />
//       </div>
//       <div>
//         <label
//           htmlFor="pincode"
//           className="block text-sm font-medium text-gray-700 mb-1"
//         >
//           Pincode
//         </label>
//         <input
//           type="text"
//           id="pincode"
//           name="pincode"
//           value={formData.pincode}
//           onChange={handleBaseChange}
//           className="w-full text-sm border-gray-300 rounded-lg"
//           placeholder="e.g., 600001"
//         />
//       </div>
//       <div className="grid grid-cols-2 gap-4">
//         <div>
//           <label
//             htmlFor="latitude"
//             className="block text-sm font-medium text-gray-700 mb-1"
//           >
//             Latitude
//           </label>
//           <input
//             type="text"
//             id="latitude"
//             name="latitude"
//             value={formData.latitude}
//             onChange={handleBaseChange}
//             className="w-full text-sm border-gray-300 rounded-lg"
//             placeholder="e.g., 13.0880"
//           />
//         </div>
//         <div>
//           <label
//             htmlFor="longitude"
//             className="block text-sm font-medium text-gray-700 mb-1"
//           >
//             Longitude
//           </label>
//           <input
//             type="text"
//             id="longitude"
//             name="longitude"
//             value={formData.longitude}
//             onChange={handleBaseChange}
//             className="w-full text-sm border-gray-300 rounded-lg"
//             placeholder="e.g., 80.2821"
//           />
//         </div>
//       </div>

//       {/* --- NEW SPLITTER ASSIGNMENT UI --- */}
//       <div className="space-y-3 pt-2">
//         <label className="block text-sm font-medium text-gray-700">
//           Assign Splitters
//         </label>
//         <div className="flex items-center gap-2">
//           <select
//             value={splitterToAdd}
//             onChange={(e) => setSplitterToAdd(e.target.value)}
//             className="flex-1 text-sm border-gray-300 rounded-lg"
//           >
//             <option value="">Select an available splitter...</option>
//             {remainingSplitters.map((s) => (
//               <option key={s.splitter_id} value={s.splitter_id}>
//                 {s.model} (ID: {s.splitter_id}, SN: {s.serial_number})
//               </option>
//             ))}
//           </select>
//           <button
//             type="button"
//             onClick={handleAddSplitter}
//             disabled={!splitterToAdd}
//             className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold disabled:bg-gray-400"
//           >
//             <PlusCircle size={16} /> Add
//           </button>
//         </div>
//         {availableSplitters.length === 0 && (
//           <p className="text-xs text-gray-500">
//             No unassigned splitters available in inventory.
//           </p>
//         )}
//         {remainingSplitters.length === 0 && availableSplitters.length > 0 && (
//           <p className="text-xs text-green-600">
//             All available splitters have been selected.
//           </p>
//         )}

//         {/* --- LIST OF SELECTED SPLITTERS --- */}
//         <div className="space-y-2">
//           {selectedSplittersList.map((s) => (
//             <div
//               key={s.splitter_id}
//               className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
//             >
//               <span className="text-sm font-medium">
//                 {s.model} (ID: {s.splitter_id})
//               </span>
//               <button
//                 type="button"
//                 onClick={() => handleRemoveSplitter(s.splitter_id)}
//                 className="p-1 text-red-500 hover:text-red-700"
//               >
//                 <X size={16} />
//               </button>
//             </div>
//           ))}
//         </div>

//         {/* Total Ports */}
//         <div className="p-3 bg-gray-50 rounded-lg text-sm">
//           Total Ports: <span className="font-bold text-lg">{totalPorts}</span>
//         </div>
//       </div>
//     </div>
//   );
// }

// // --- Main AddAssetModal Component ---

// // --- MODIFIED: Updated initial state ---
// const initialFormData = {
//   model: "",
//   serial: "",
//   ratio: "1:8",
//   selectedSplitters: [], // --- CHANGED: Was splitterGroups
//   pincode: "",
//   latitude: "",
//   longitude: "",
// };

// export default function AddAssetModal({
//   isOpen,
//   onClose,
//   availableSplitters, // --- NEW: Added prop
// }) {
//   const [mode, setMode] = useState("manual");
//   const [assetType, setAssetType] = useState("ONT");
//   const [formData, setFormData] = useState(initialFormData);
//   const [file, setFile] = useState(null);
//   const [isDirty, setIsDirty] = useState(false);
//   const [isDragging, setIsDragging] = useState(false);
//   const [showConfirm, setShowConfirm] = useState(false);

//   // --- MODIFIED: Updated dirty check ---
//   useEffect(() => {
//     if (
//       formData.model ||
//       formData.serial ||
//       formData.pincode ||
//       formData.latitude ||
//       formData.longitude ||
//       formData.selectedSplitters.length > 0 || // --- CHANGED
//       file
//     ) {
//       setIsDirty(true);
//     } else {
//       setIsDirty(false);
//     }
//   }, [formData, file]);

//   const handleAssetTypeChange = (e) => {
//     setAssetType(e.target.value);
//     setFormData(initialFormData);
//   };

//   // ... (Close & Confirmation Logic is unchanged) ...
//   const handleCloseRequest = () => {
//     if (isDirty) {
//       setShowConfirm(true);
//     } else {
//       performClose();
//     }
//   };
//   const handleConfirmClose = () => {
//     setShowConfirm(false);
//     performClose();
//   };
//   const performClose = () => {
//     setMode("manual");
//     setAssetType("ONT");
//     setFormData(initialFormData);
//     setFile(null);
//     setIsDirty(false);
//     onClose();
//   };

//   // ... (handleSubmit logic is unchanged) ...
//   const handleSubmit = () => {
//     let submissionData = {
//       assetType,
//       mode,
//     };

//     if (mode === "manual") {
//       submissionData.formData = formData;
//     } else {
//       submissionData.file = file;
//     }

//     console.log("Submitting:", submissionData);
//     performClose();
//   };

//   // ... (CSV Drag & Drop Handlers are unchanged) ...
//   const handleDragOver = (e) => {
//     e.preventDefault();
//     setIsDragging(true);
//   };
//   const handleDragLeave = (e) => {
//     e.preventDefault();
//     setIsDragging(false);
//   };
//   const handleDrop = (e) => {
//     e.preventDefault();
//     setIsDragging(false);
//     const droppedFile = e.dataTransfer.files[0];
//     if (droppedFile && droppedFile.type === "text/csv") {
//       setFile(droppedFile);
//     } else {
//       alert("Please drop a valid .csv file.");
//     }
//   };
//   const handleFileSelect = (e) => {
//     const selectedFile = e.target.files[0];
//     if (selectedFile && selectedFile.type === "text/csv") {
//       setFile(selectedFile);
//     } else {
//       alert("Please select a valid .csv file.");
//     }
//   };

//   // --- MODIFIED: renderManualForm ---
//   const renderManualForm = () => {
//     switch (assetType) {
//       case "ONT":
//       case "Router":
//         return <OntRouterForm formData={formData} setFormData={setFormData} />;
//       case "Splitter":
//         return <SplitterForm formData={formData} setFormData={setFormData} />;
//       case "FDH":
//         return (
//           <FdhForm
//             formData={formData}
//             setFormData={setFormData}
//             availableSplitters={availableSplitters} // --- NEW: Pass prop
//           />
//         );
//       default:
//         return null;
//     }
//   };

//   // ... (renderCsvForm is unchanged) ...
//   const renderCsvForm = () => (
//     <div className="space-y-4">
//       {!file ? (
//         <label
//           onDragOver={handleDragOver}
//           onDragLeave={handleDragLeave}
//           onDrop={handleDrop}
//           className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer ${
//             isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
//           }`}
//         >
//           <UploadCloud size={40} className="text-gray-400" />
//           <p className="text-sm font-semibold text-gray-700">
//             Drag & drop your .csv file here
//           </p>
//           <p className="text-xs text-gray-500">or click to browse</p>
//           <input
//             type="file"
//             accept=".csv"
//             onChange={handleFileSelect}
//             className="hidden"
//           />
//         </label>
//       ) : (
//         <div className="flex items-center justify-between p-3 border border-gray-300 rounded-lg bg-gray-50">
//           <div className="flex items-center gap-3">
//             <FileText size={20} className="text-blue-600" />
//             <span className="text-sm font-medium text-gray-800">
//               {file.name}
//             </span>
//           </div>
//           <button
//             onClick={() => setFile(null)}
//             className="p-1 text-red-500 hover:text-red-700"
//           >
//             <Trash2 size={16} />
//           </button>
//         </div>
//       )}
//       <p className="text-xs text-gray-500">
//         Note: The CSV must follow the required format for the selected asset
//         type (<strong>{assetType}</strong>).
//       </p>
//     </div>
//   );

//   if (!isOpen) return null;

//   return (
//     <>
//       {/* Backdrop */}
//       <div
//         onClick={handleCloseRequest}
//         className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center"
//       >
//         {/* --- MODIFIED: Fixed height modal --- */}
//         <div
//           onClick={(e) => e.stopPropagation()}
//           className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl h-2/3 flex flex-col"
//         >
//           {/* Header (Unchanged) */}
//           <div className="flex items-center justify-between p-4 border-b">
//             <h3 className="text-lg font-semibold text-gray-900">
//               Add New Assets
//             </h3>
//             <button
//               onClick={handleCloseRequest}
//               className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
//             >
//               <X size={20} />
//             </button>
//           </div>

//           {/* --- MODIFIED: Scrollable Body --- */}
//           <div className="p-6 space-y-5 overflow-y-auto flex-1">
//             {/* Top Row: Mode Toggle & Asset Type */}
//             <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
//               {/* Asset Type Dropdown */}
//               <div>
//                 <label
//                   htmlFor="assetType"
//                   className="block text-xs font-medium text-gray-600"
//                 >
//                   Asset Type
//                 </label>
//                 <select
//                   id="assetType"
//                   name="assetType"
//                   value={assetType}
//                   onChange={handleAssetTypeChange}
//                   className="mt-1 text-sm border-gray-300 rounded-lg"
//                 >
//                   <option value="ONT">ONT</option>
//                   <option value="Router">Router</option>
//                   <option value="Splitter">Splitter</option>
//                   <option value="FDH">FDH</option>
//                 </select>
//               </div>

//               {/* Mode Toggle */}
//               <div className="flex items-center p-1 bg-gray-200 rounded-lg">
//                 <button
//                   onClick={() => setMode("manual")}
//                   className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm font-semibold ${
//                     mode === "manual"
//                       ? "bg-white text-blue-600 shadow"
//                       : "text-gray-600"
//                   }`}
//                 >
//                   <ChevronLeft size={16} /> Manual
//                 </button>
//                 <button
//                   onClick={() => setMode("csv")}
//                   className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm font-semibold ${
//                     mode === "csv"
//                       ? "bg-white text-blue-600 shadow"
//                       : "text-gray-600"
//                   }`}
//                 >
//                   CSV <ChevronRight size={16} />
//                 </button>
//               </div>
//             </div>

//             {/* Dynamic Form Area */}
//             <div className="pt-2">
//               {mode === "manual" ? renderManualForm() : renderCsvForm()}
//             </div>
//           </div>

//           {/* Footer (Unchanged) */}
//           <div className="flex justify-end gap-3 p-4 bg-gray-50 border-t rounded-b-xl">
//             <button
//               onClick={handleCloseRequest}
//               className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleSubmit}
//               className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
//             >
//               Create Asset(s)
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Confirmation Modal (Unchanged) */}
//       <ConfirmationModal
//         isOpen={showConfirm}
//         onClose={() => setShowConfirm(false)}
//         onConfirm={handleConfirmClose}
//         title="Discard Changes?"
//       >
//         <p>
//           You have unsaved changes. Are you sure you want to discard them and
//           close the window?
//         </p>
//       </ConfirmationModal>
//     </>
//   );
// }

// import { useState, useEffect } from "react";
// import ConfirmationModal from "./ConfirmationModal";
// import {
//   X,
//   UploadCloud,
//   FileText,
//   Trash2,
//   ChevronLeft,
//   ChevronRight,
//   PlusCircle,
//   Loader2, // Import Loader for the button
// } from "lucide-react";
// // --- FIX: Import the create function ---
// import { createAsset } from "../../api/assetApi";

// // --- MODIFIED: Added Pincode Field ---
// function OntRouterForm({ formData, setFormData }) {
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   return (
//     <div className="space-y-4">
//       <div>
//         <label
//           htmlFor="model"
//           className="block text-sm font-medium text-gray-700 mb-1"
//         >
//           Model
//         </label>
//         <input
//           type="text"
//           id="model"
//           name="model"
//           value={formData.model}
//           onChange={handleChange}
//           className="w-full text-sm border-gray-300 rounded-lg"
//           placeholder="e.g., Nokia G-140W-C"
//         />
//       </div>
//       <div>
//         <label
//           htmlFor="serial"
//           className="block text-sm font-medium text-gray-700 mb-1"
//         >
//           Serial Number
//         </label>
//         <input
//           type="text"
//           id="serial"
//           name="serial"
//           value={formData.serial}
//           onChange={handleChange}
//           className="w-full text-sm border-gray-300 rounded-lg"
//           placeholder="e.g., NK12345678"
//         />
//       </div>
//       {/* --- NEW FIELD: Pincode (Required by Backend) --- */}
//       <div>
//         <label
//           htmlFor="pincode"
//           className="block text-sm font-medium text-gray-700 mb-1"
//         >
//           Pincode (Location)
//         </label>
//         <input
//           type="text"
//           id="pincode"
//           name="pincode"
//           value={formData.pincode}
//           onChange={handleChange}
//           className="w-full text-sm border-gray-300 rounded-lg"
//           placeholder="e.g., 600001"
//         />
//       </div>
//     </div>
//   );
// }

// // ... (SplitterForm component is unchanged) ...
// function SplitterForm({ formData, setFormData }) {
//   const ratios = ["1:8", "1:16", "1:32", "1:64"];

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   return (
//     <div className="space-y-4">
//       <div>
//         <label
//           htmlFor="model"
//           className="block text-sm font-medium text-gray-700 mb-1"
//         >
//           Model
//         </label>
//         <input
//           type="text"
//           id="model"
//           name="model"
//           value={formData.model}
//           onChange={handleChange}
//           className="w-full text-sm border-gray-300 rounded-lg"
//           placeholder="e.g., 1:8 Passive"
//         />
//       </div>
//       <div>
//         <label
//           htmlFor="serial"
//           className="block text-sm font-medium text-gray-700 mb-1"
//         >
//           Serial Number
//         </label>
//         <input
//           type="text"
//           id="serial"
//           name="serial"
//           value={formData.serial}
//           onChange={handleChange}
//           className="w-full text-sm border-gray-300 rounded-lg"
//           placeholder="e.g., SPL12345"
//         />
//       </div>
//       <div className="space-y-2 pt-2">
//         <label className="block text-sm font-medium text-gray-700">
//           Select Splitter Ratio
//         </label>
//         <div className="flex flex-wrap gap-3">
//           {ratios.map((ratio) => (
//             <button
//               key={ratio}
//               type="button"
//               onClick={() => setFormData((prev) => ({ ...prev, ratio }))}
//               className={`px-4 py-2 rounded-lg text-sm font-semibold ${
//                 formData.ratio === ratio
//                   ? "bg-blue-600 text-white"
//                   : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//               }`}
//             >
//               {ratio}
//             </button>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// // ... (FdhForm component is unchanged) ...
// function FdhForm({ formData, setFormData, availableSplitters }) {
//   const [splitterToAdd, setSplitterToAdd] = useState("");

//   const handleBaseChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const selectedIds = formData.selectedSplitters;
//   const remainingSplitters = availableSplitters.filter(
//     (s) => !selectedIds.includes(s.splitter_id)
//   );

//   const selectedSplittersList = formData.selectedSplitters
//     .map((id) => availableSplitters.find((s) => s.splitter_id === id))
//     .filter(Boolean);

//   const totalPorts = selectedSplittersList.reduce(
//     (acc, s) => acc + s.max_ports,
//     0
//   );

//   const handleAddSplitter = () => {
//     if (!splitterToAdd) return;
//     setFormData((prev) => ({
//       ...prev,
//       selectedSplitters: [...prev.selectedSplitters, parseInt(splitterToAdd)],
//     }));
//     setSplitterToAdd("");
//   };

//   const handleRemoveSplitter = (idToRemove) => {
//     setFormData((prev) => ({
//       ...prev,
//       selectedSplitters: prev.selectedSplitters.filter(
//         (id) => id !== idToRemove
//       ),
//     }));
//   };

//   return (
//     <div className="space-y-4">
//       {/* FDH Base Fields */}
//       <div>
//         <label
//           htmlFor="model"
//           className="block text-sm font-medium text-gray-700 mb-1"
//         >
//           Model
//         </label>
//         <input
//           type="text"
//           id="model"
//           name="model"
//           value={formData.model}
//           onChange={handleBaseChange}
//           className="w-full text-sm border-gray-300 rounded-lg"
//           placeholder="e.g., Nokia FX-8"
//         />
//       </div>
//       <div>
//         <label
//           htmlFor="pincode"
//           className="block text-sm font-medium text-gray-700 mb-1"
//         >
//           Pincode
//         </label>
//         <input
//           type="text"
//           id="pincode"
//           name="pincode"
//           value={formData.pincode}
//           onChange={handleBaseChange}
//           className="w-full text-sm border-gray-300 rounded-lg"
//           placeholder="e.g., 600001"
//         />
//       </div>
//       <div className="grid grid-cols-2 gap-4">
//         <div>
//           <label
//             htmlFor="latitude"
//             className="block text-sm font-medium text-gray-700 mb-1"
//           >
//             Latitude
//           </label>
//           <input
//             type="text"
//             id="latitude"
//             name="latitude"
//             value={formData.latitude}
//             onChange={handleBaseChange}
//             className="w-full text-sm border-gray-300 rounded-lg"
//             placeholder="e.g., 13.0880"
//           />
//         </div>
//         <div>
//           <label
//             htmlFor="longitude"
//             className="block text-sm font-medium text-gray-700 mb-1"
//           >
//             Longitude
//           </label>
//           <input
//             type="text"
//             id="longitude"
//             name="longitude"
//             value={formData.longitude}
//             onChange={handleBaseChange}
//             className="w-full text-sm border-gray-300 rounded-lg"
//             placeholder="e.g., 80.2821"
//           />
//         </div>
//       </div>

//       {/* --- NEW SPLITTER ASSIGNMENT UI --- */}
//       <div className="space-y-3 pt-2">
//         <label className="block text-sm font-medium text-gray-700">
//           Assign Splitters
//         </label>
//         <div className="flex items-center gap-2">
//           <select
//             value={splitterToAdd}
//             onChange={(e) => setSplitterToAdd(e.target.value)}
//             className="flex-1 text-sm border-gray-300 rounded-lg"
//           >
//             <option value="">Select an available splitter...</option>
//             {remainingSplitters.map((s) => (
//               <option key={s.splitter_id} value={s.splitter_id}>
//                 {s.model} (ID: {s.splitter_id}, SN: {s.serial_number})
//               </option>
//             ))}
//           </select>
//           <button
//             type="button"
//             onClick={handleAddSplitter}
//             disabled={!splitterToAdd}
//             className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold disabled:bg-gray-400"
//           >
//             <PlusCircle size={16} /> Add
//           </button>
//         </div>
//         {availableSplitters.length === 0 && (
//           <p className="text-xs text-gray-500">
//             No unassigned splitters available in inventory.
//           </p>
//         )}
//         {remainingSplitters.length === 0 && availableSplitters.length > 0 && (
//           <p className="text-xs text-green-600">
//             All available splitters have been selected.
//           </p>
//         )}

//         {/* --- LIST OF SELECTED SPLITTERS --- */}
//         <div className="space-y-2">
//           {selectedSplittersList.map((s) => (
//             <div
//               key={s.splitter_id}
//               className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
//             >
//               <span className="text-sm font-medium">
//                 {s.model} (ID: {s.splitter_id})
//               </span>
//               <button
//                 type="button"
//                 onClick={() => handleRemoveSplitter(s.splitter_id)}
//                 className="p-1 text-red-500 hover:text-red-700"
//               >
//                 <X size={16} />
//               </button>
//             </div>
//           ))}
//         </div>

//         {/* Total Ports */}
//         <div className="p-3 bg-gray-50 rounded-lg text-sm">
//           Total Ports: <span className="font-bold text-lg">{totalPorts}</span>
//         </div>
//       </div>
//     </div>
//   );
// }

// // --- Main AddAssetModal Component ---

// const initialFormData = {
//   model: "",
//   serial: "",
//   ratio: "1:8",
//   selectedSplitters: [],
//   pincode: "",
//   latitude: "",
//   longitude: "",
// };

// export default function AddAssetModal({
//   isOpen,
//   onClose,
//   availableSplitters,
//   onSuccess, // --- NEW: Added prop to trigger refresh
// }) {
//   const [mode, setMode] = useState("manual");
//   const [assetType, setAssetType] = useState("ONT");
//   const [formData, setFormData] = useState(initialFormData);
//   const [file, setFile] = useState(null);
//   const [isDirty, setIsDirty] = useState(false);
//   const [isDragging, setIsDragging] = useState(false);
//   const [showConfirm, setShowConfirm] = useState(false);

//   // --- NEW State for submission ---
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     if (
//       formData.model ||
//       formData.serial ||
//       formData.pincode ||
//       formData.latitude ||
//       formData.longitude ||
//       formData.selectedSplitters.length > 0 ||
//       file
//     ) {
//       setIsDirty(true);
//     } else {
//       setIsDirty(false);
//     }
//   }, [formData, file]);

//   const handleAssetTypeChange = (e) => {
//     setAssetType(e.target.value);
//     setFormData(initialFormData);
//     setError(""); // Clear error on type change
//   };

//   const handleCloseRequest = () => {
//     if (isDirty) {
//       setShowConfirm(true);
//     } else {
//       performClose();
//     }
//   };
//   const handleConfirmClose = () => {
//     setShowConfirm(false);
//     performClose();
//   };
//   const performClose = () => {
//     setMode("manual");
//     setAssetType("ONT");
//     setFormData(initialFormData);
//     setFile(null);
//     setIsDirty(false);
//     setError("");
//     onClose();
//   };

//   // --- MODIFIED: Handle Submit ---
//   const handleSubmit = async () => {
//     // For now, only handle manual ONT/Router creation
//     if (mode === "manual" && (assetType === "ONT" || assetType === "Router")) {
//       setIsSubmitting(true);
//       setError("");

//       try {
//         const payload = {
//           type: assetType,
//           model: formData.model,
//           status: "available",
//           serial_number: formData.serial, // Map 'serial' to 'serial_number'
//           pincode: formData.pincode,
//         };

//         await createAsset(payload);

//         // If successful:
//         onSuccess(); // Call parent refresh
//         performClose(); // Close modal (which also resets state)
//       } catch (err) {
//         console.error("Creation failed:", err);
//         const msg = err.response?.data?.detail || "Failed to create asset.";
//         setError(msg);
//       } finally {
//         setIsSubmitting(false);
//       }
//     } else {
//       // Logic for CSV or other types (FDH/Splitter) not yet implemented on backend
//       console.log(
//         "Submit logic for this type/mode is pending:",
//         assetType,
//         mode
//       );
//       if (assetType === "FDH" || assetType === "Splitter") {
//         alert("Creating FDH/Splitter is not yet connected to the backend.");
//       }
//       performClose();
//     }
//   };

//   // ... (Drag/Drop handlers unchanged) ...
//   const handleDragOver = (e) => {
//     e.preventDefault();
//     setIsDragging(true);
//   };
//   const handleDragLeave = (e) => {
//     e.preventDefault();
//     setIsDragging(false);
//   };
//   const handleDrop = (e) => {
//     e.preventDefault();
//     setIsDragging(false);
//     const droppedFile = e.dataTransfer.files[0];
//     if (droppedFile && droppedFile.type === "text/csv") {
//       setFile(droppedFile);
//     } else {
//       alert("Please drop a valid .csv file.");
//     }
//   };
//   const handleFileSelect = (e) => {
//     const selectedFile = e.target.files[0];
//     if (selectedFile && selectedFile.type === "text/csv") {
//       setFile(selectedFile);
//     } else {
//       alert("Please select a valid .csv file.");
//     }
//   };

//   // ... (renderManualForm uses the updated sub-components) ...
//   const renderManualForm = () => {
//     switch (assetType) {
//       case "ONT":
//       case "Router":
//         return <OntRouterForm formData={formData} setFormData={setFormData} />;
//       case "Splitter":
//         return <SplitterForm formData={formData} setFormData={setFormData} />;
//       case "FDH":
//         return (
//           <FdhForm
//             formData={formData}
//             setFormData={setFormData}
//             availableSplitters={availableSplitters}
//           />
//         );
//       default:
//         return null;
//     }
//   };

//   const renderCsvForm = () => (
//     <div className="space-y-4">
//       {!file ? (
//         <label
//           onDragOver={handleDragOver}
//           onDragLeave={handleDragLeave}
//           onDrop={handleDrop}
//           className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer ${
//             isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
//           }`}
//         >
//           <UploadCloud size={40} className="text-gray-400" />
//           <p className="text-sm font-semibold text-gray-700">
//             Drag & drop your .csv file here
//           </p>
//           <p className="text-xs text-gray-500">or click to browse</p>
//           <input
//             type="file"
//             accept=".csv"
//             onChange={handleFileSelect}
//             className="hidden"
//           />
//         </label>
//       ) : (
//         <div className="flex items-center justify-between p-3 border border-gray-300 rounded-lg bg-gray-50">
//           <div className="flex items-center gap-3">
//             <FileText size={20} className="text-blue-600" />
//             <span className="text-sm font-medium text-gray-800">
//               {file.name}
//             </span>
//           </div>
//           <button
//             onClick={() => setFile(null)}
//             className="p-1 text-red-500 hover:text-red-700"
//           >
//             <Trash2 size={16} />
//           </button>
//         </div>
//       )}
//       <p className="text-xs text-gray-500">
//         Note: The CSV must follow the required format for the selected asset
//         type (<strong>{assetType}</strong>).
//       </p>
//     </div>
//   );

//   if (!isOpen) return null;

//   return (
//     <>
//       <div
//         onClick={handleCloseRequest}
//         className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center"
//       >
//         <div
//           onClick={(e) => e.stopPropagation()}
//           className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl h-2/3 flex flex-col"
//         >
//           <div className="flex items-center justify-between p-4 border-b">
//             <h3 className="text-lg font-semibold text-gray-900">
//               Add New Assets
//             </h3>
//             <button
//               onClick={handleCloseRequest}
//               className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
//             >
//               <X size={20} />
//             </button>
//           </div>

//           <div className="p-6 space-y-5 overflow-y-auto flex-1">
//             {/* --- NEW ERROR DISPLAY --- */}
//             {error && (
//               <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm border border-red-200">
//                 {error}
//               </div>
//             )}

//             <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
//               <div>
//                 <label
//                   htmlFor="assetType"
//                   className="block text-xs font-medium text-gray-600"
//                 >
//                   Asset Type
//                 </label>
//                 <select
//                   id="assetType"
//                   name="assetType"
//                   value={assetType}
//                   onChange={handleAssetTypeChange}
//                   className="mt-1 text-sm border-gray-300 rounded-lg"
//                 >
//                   <option value="ONT">ONT</option>
//                   <option value="Router">Router</option>
//                   <option value="Splitter">Splitter</option>
//                   <option value="FDH">FDH</option>
//                 </select>
//               </div>

//               <div className="flex items-center p-1 bg-gray-200 rounded-lg">
//                 <button
//                   onClick={() => setMode("manual")}
//                   className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm font-semibold ${
//                     mode === "manual"
//                       ? "bg-white text-blue-600 shadow"
//                       : "text-gray-600"
//                   }`}
//                 >
//                   <ChevronLeft size={16} /> Manual
//                 </button>
//                 <button
//                   onClick={() => setMode("csv")}
//                   className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm font-semibold ${
//                     mode === "csv"
//                       ? "bg-white text-blue-600 shadow"
//                       : "text-gray-600"
//                   }`}
//                 >
//                   CSV <ChevronRight size={16} />
//                 </button>
//               </div>
//             </div>

//             <div className="pt-2">
//               {mode === "manual" ? renderManualForm() : renderCsvForm()}
//             </div>
//           </div>

//           <div className="flex justify-end gap-3 p-4 bg-gray-50 border-t rounded-b-xl">
//             <button
//               onClick={handleCloseRequest}
//               disabled={isSubmitting}
//               className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleSubmit}
//               disabled={isSubmitting}
//               className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2"
//             >
//               {isSubmitting && <Loader2 size={16} className="animate-spin" />}
//               {isSubmitting ? "Creating..." : "Create Asset(s)"}
//             </button>
//           </div>
//         </div>
//       </div>

//       <ConfirmationModal
//         isOpen={showConfirm}
//         onClose={() => setShowConfirm(false)}
//         onConfirm={handleConfirmClose}
//         title="Discard Changes?"
//       >
//         <p>
//           You have unsaved changes. Are you sure you want to discard them and
//           close the window?
//         </p>
//       </ConfirmationModal>
//     </>
//   );
// }

import { useState, useEffect } from "react";
import ConfirmationModal from "./ConfirmationModal.jsx";
import {
  X,
  UploadCloud,
  FileText,
  Trash2,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  Loader2,
} from "lucide-react";
// --- FIX: Import the new bulk function ---
import { createAsset, createAssetsBulk } from "../../api/assetApi.js";

// ... (OntRouterForm, SplitterForm, FdhForm components remain unchanged) ...
function OntRouterForm({ formData, setFormData }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  return (
    <div className="space-y-4">
      <div>
        <label
          htmlFor="model"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Model
        </label>
        <input
          type="text"
          id="model"
          name="model"
          value={formData.model}
          onChange={handleChange}
          className="w-full text-sm border-gray-300 rounded-lg"
          placeholder="e.g., Nokia G-140W-C"
        />
      </div>
      <div>
        <label
          htmlFor="serial"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Serial Number
        </label>
        <input
          type="text"
          id="serial"
          name="serial"
          value={formData.serial}
          onChange={handleChange}
          className="w-full text-sm border-gray-300 rounded-lg"
          placeholder="e.g., NK12345678"
        />
      </div>
      <div>
        <label
          htmlFor="pincode"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Pincode (Location)
        </label>
        <input
          type="text"
          id="pincode"
          name="pincode"
          value={formData.pincode}
          onChange={handleChange}
          className="w-full text-sm border-gray-300 rounded-lg"
          placeholder="e.g., 600001"
        />
      </div>
    </div>
  );
}

function SplitterForm({ formData, setFormData }) {
  const ratios = ["1:8", "1:16", "1:32", "1:64"];
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Model
        </label>
        <input
          type="text"
          name="model"
          value={formData.model}
          onChange={handleChange}
          className="w-full text-sm border-gray-300 rounded-lg"
          placeholder="e.g., 1:8 Passive"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Serial Number
        </label>
        <input
          type="text"
          name="serial"
          value={formData.serial}
          onChange={handleChange}
          className="w-full text-sm border-gray-300 rounded-lg"
          placeholder="e.g., SPL12345"
        />
      </div>
      <div className="space-y-2 pt-2">
        <label className="block text-sm font-medium text-gray-700">
          Select Splitter Ratio
        </label>
        <div className="flex flex-wrap gap-3">
          {ratios.map((ratio) => (
            <button
              key={ratio}
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, ratio }))}
              className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                formData.ratio === ratio
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {ratio}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function FdhForm({ formData, setFormData, availableSplitters }) {
  const [splitterToAdd, setSplitterToAdd] = useState("");
  const handleBaseChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const selectedIds = formData.selectedSplitters;
  const remainingSplitters = availableSplitters.filter(
    (s) => !selectedIds.includes(s.splitter_id)
  );
  const selectedSplittersList = formData.selectedSplitters
    .map((id) => availableSplitters.find((s) => s.splitter_id === id))
    .filter(Boolean);
  const totalPorts = selectedSplittersList.reduce(
    (acc, s) => acc + s.max_ports,
    0
  );
  const handleAddSplitter = () => {
    if (!splitterToAdd) return;
    setFormData((prev) => ({
      ...prev,
      selectedSplitters: [...prev.selectedSplitters, parseInt(splitterToAdd)],
    }));
    setSplitterToAdd("");
  };
  const handleRemoveSplitter = (idToRemove) => {
    setFormData((prev) => ({
      ...prev,
      selectedSplitters: prev.selectedSplitters.filter(
        (id) => id !== idToRemove
      ),
    }));
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Model
        </label>
        <input
          type="text"
          name="model"
          value={formData.model}
          onChange={handleBaseChange}
          className="w-full text-sm border-gray-300 rounded-lg"
          placeholder="e.g., Nokia FX-8"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Pincode
        </label>
        <input
          type="text"
          name="pincode"
          value={formData.pincode}
          onChange={handleBaseChange}
          className="w-full text-sm border-gray-300 rounded-lg"
          placeholder="e.g., 600001"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Latitude
          </label>
          <input
            type="text"
            name="latitude"
            value={formData.latitude}
            onChange={handleBaseChange}
            className="w-full text-sm border-gray-300 rounded-lg"
            placeholder="e.g., 13.0880"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Longitude
          </label>
          <input
            type="text"
            name="longitude"
            value={formData.longitude}
            onChange={handleBaseChange}
            className="w-full text-sm border-gray-300 rounded-lg"
            placeholder="e.g., 80.2821"
          />
        </div>
      </div>
      <div className="space-y-3 pt-2">
        <label className="block text-sm font-medium text-gray-700">
          Assign Splitters
        </label>
        <div className="flex items-center gap-2">
          <select
            value={splitterToAdd}
            onChange={(e) => setSplitterToAdd(e.target.value)}
            className="flex-1 text-sm border-gray-300 rounded-lg"
          >
            <option value="">Select an available splitter...</option>
            {remainingSplitters.map((s) => (
              <option key={s.splitter_id} value={s.splitter_id}>
                {s.model} (ID: {s.splitter_id}, SN: {s.serial_number})
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleAddSplitter}
            disabled={!splitterToAdd}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold disabled:bg-gray-400"
          >
            <PlusCircle size={16} /> Add
          </button>
        </div>
        <div className="space-y-2">
          {selectedSplittersList.map((s) => (
            <div
              key={s.splitter_id}
              className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
            >
              <span className="text-sm font-medium">
                {s.model} (ID: {s.splitter_id})
              </span>
              <button
                type="button"
                onClick={() => handleRemoveSplitter(s.splitter_id)}
                className="p-1 text-red-500 hover:text-red-700"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
        <div className="p-3 bg-gray-50 rounded-lg text-sm">
          Total Ports: <span className="font-bold text-lg">{totalPorts}</span>
        </div>
      </div>
    </div>
  );
}

// --- Main Component ---
const initialFormData = {
  model: "",
  serial: "",
  ratio: "1:8",
  selectedSplitters: [],
  pincode: "",
  latitude: "",
  longitude: "",
};

export default function AddAssetModal({
  isOpen,
  onClose,
  availableSplitters,
  onSuccess,
}) {
  const [mode, setMode] = useState("manual");
  const [assetType, setAssetType] = useState("ONT");
  const [formData, setFormData] = useState(initialFormData);
  const [file, setFile] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (
      formData.model ||
      formData.serial ||
      formData.pincode ||
      formData.latitude ||
      formData.longitude ||
      formData.selectedSplitters.length > 0 ||
      file
    ) {
      setIsDirty(true);
    } else {
      setIsDirty(false);
    }
  }, [formData, file]);

  const handleAssetTypeChange = (e) => {
    setAssetType(e.target.value);
    setFormData(initialFormData);
    setFile(null); // Reset file when type changes
    setError("");
  };

  const handleCloseRequest = () => {
    if (isDirty) setShowConfirm(true);
    else performClose();
  };
  const handleConfirmClose = () => {
    setShowConfirm(false);
    performClose();
  };
  const performClose = () => {
    setMode("manual");
    setAssetType("ONT");
    setFormData(initialFormData);
    setFile(null);
    setIsDirty(false);
    setError("");
    onClose();
  };

  // --- MODIFIED: Handle Submit with strict validation ---
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError("");

    try {
      if (
        mode === "manual" &&
        (assetType === "ONT" || assetType === "Router")
      ) {
        // --- 1. MANUAL VALIDATION ---
        // Ensure strings are not empty or just whitespace
        if (
          !formData.model?.trim() ||
          !formData.serial?.trim() ||
          !formData.pincode?.trim()
        ) {
          throw new Error("Model, Serial Number, and Pincode are required.");
        }

        const payload = {
          type: assetType,
          model: formData.model.trim(),
          serial_number: formData.serial.trim(),
          pincode: formData.pincode.trim(),
          status: "available",
        };

        await createAsset(payload);
        onSuccess();
        performClose();
      } else if (mode === "csv" && file) {
        // --- CSV Submit ---
        const reader = new FileReader();
        reader.onload = async (e) => {
          const text = e.target.result;
          try {
            // 1. Basic CSV Parsing
            const rows = text
              .split("\n")
              .map((r) => r.trim())
              .filter((r) => r);
            if (rows.length < 2)
              throw new Error(
                "CSV file appears to be empty or missing data rows."
              );

            // 2. Skip header, map rows to objects
            // Assuming format: Model, SerialNumber, Pincode
            const assetsToCreate = rows.slice(1).map((row, index) => {
              const cols = row.split(",");

              // --- 2. CSV VALIDATION ---
              if (cols.length < 3)
                throw new Error(
                  `Row ${index + 2} is missing required columns.`
                );

              const model = cols[0].trim();
              const serial = cols[1].trim();
              const pincode = cols[2].trim();

              // Check for empty values
              if (!model || !serial || !pincode) {
                throw new Error(
                  `Row ${
                    index + 2
                  } contains empty fields. All fields are required.`
                );
              }

              return {
                type: assetType,
                model: model,
                serial_number: serial,
                pincode: pincode,
                status: "available",
              };
            });

            // 3. Send batch to backend
            await createAssetsBulk(assetsToCreate);

            onSuccess();
            performClose();
          } catch (err) {
            console.error("Bulk creation failed:", err);
            // Extract backend error detail if available, else use local error
            const msg =
              err.response?.data?.detail ||
              err.message ||
              "Failed to process CSV.";
            setError(msg);
            setIsSubmitting(false); // Stop loading spinner on error
          }
        };
        reader.onerror = () => {
          setError("Failed to read file.");
          setIsSubmitting(false);
        };
        reader.readAsText(file);
        // Return here to wait for reader (isSubmitting stays true until reader finishes)
        return;
      } else {
        // Logic for other types (FDH/Splitter) not yet implemented
        console.log("Submit logic pending for:", assetType, mode);
        if (assetType === "FDH" || assetType === "Splitter") {
          alert("Creating FDH/Splitter is not yet connected to the backend.");
        }
        performClose();
      }
    } catch (err) {
      // Catch errors from manual submit (CSV errors handled inside onload)
      console.error("Creation failed:", err);
      const msg =
        err.response?.data?.detail || err.message || "Failed to create asset.";
      setError(msg);
      setIsSubmitting(false);
    }

    // Only reset submitting if we didn't return early (like in CSV)
    if (mode === "manual") {
      setIsSubmitting(false);
    }
  };

  // ... (Drag/Drop handlers unchanged) ...
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files[0]?.type === "text/csv")
      setFile(e.dataTransfer.files[0]);
    else alert("Invalid CSV");
  };
  const handleFileSelect = (e) => {
    if (e.target.files[0]?.type === "text/csv") setFile(e.target.files[0]);
    else alert("Invalid CSV");
  };

  const renderManualForm = () => {
    switch (assetType) {
      case "ONT":
      case "Router":
        return <OntRouterForm formData={formData} setFormData={setFormData} />;
      case "Splitter":
        return <SplitterForm formData={formData} setFormData={setFormData} />;
      case "FDH":
        return (
          <FdhForm
            formData={formData}
            setFormData={setFormData}
            availableSplitters={availableSplitters}
          />
        );
      default:
        return null;
    }
  };

  const renderCsvForm = () => (
    <div className="space-y-4">
      {!file ? (
        <label
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer ${
            isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
          }`}
        >
          <UploadCloud size={40} className="text-gray-400" />
          <p className="text-sm font-semibold text-gray-700">
            Drag & drop your .csv file here
          </p>
          <p className="text-xs text-gray-500">or click to browse</p>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            className="hidden"
          />
        </label>
      ) : (
        <div className="flex items-center justify-between p-3 border border-gray-300 rounded-lg bg-gray-50">
          <div className="flex items-center gap-3">
            <FileText size={20} className="text-blue-600" />
            <span className="text-sm font-medium text-gray-800">
              {file.name}
            </span>
          </div>
          <button
            onClick={() => setFile(null)}
            className="p-1 text-red-500 hover:text-red-700"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )}
      <div className="text-xs text-gray-500">
        <p className="font-semibold mb-1">
          Required CSV Format (Header Row Required):
        </p>
        <code className="bg-gray-100 px-1 py-0.5 rounded">
          Model, SerialNumber, Pincode
        </code>
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <>
      <div
        onClick={handleCloseRequest}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl h-2/3 flex flex-col"
        >
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-semibold text-gray-900">
              Add New Assets
            </h3>
            <button
              onClick={handleCloseRequest}
              className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-6 space-y-5 overflow-y-auto flex-1">
            {error && (
              <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm border border-red-200">
                {error}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <label
                  htmlFor="assetType"
                  className="block text-xs font-medium text-gray-600"
                >
                  Asset Type
                </label>
                <select
                  id="assetType"
                  name="assetType"
                  value={assetType}
                  onChange={handleAssetTypeChange}
                  className="mt-1 text-sm border-gray-300 rounded-lg"
                >
                  <option value="ONT">ONT</option>
                  <option value="Router">Router</option>
                  <option value="Splitter">Splitter</option>
                  <option value="FDH">FDH</option>
                </select>
              </div>
              <div className="flex items-center p-1 bg-gray-200 rounded-lg">
                <button
                  onClick={() => setMode("manual")}
                  className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm font-semibold ${
                    mode === "manual"
                      ? "bg-white text-blue-600 shadow"
                      : "text-gray-600"
                  }`}
                >
                  <ChevronLeft size={16} /> Manual
                </button>
                <button
                  onClick={() => setMode("csv")}
                  className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm font-semibold ${
                    mode === "csv"
                      ? "bg-white text-blue-600 shadow"
                      : "text-gray-600"
                  }`}
                >
                  CSV <ChevronRight size={16} />
                </button>
              </div>
            </div>

            <div className="pt-2">
              {mode === "manual" ? renderManualForm() : renderCsvForm()}
            </div>
          </div>

          <div className="flex justify-end gap-3 p-4 bg-gray-50 border-t rounded-b-xl">
            <button
              onClick={handleCloseRequest}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2"
            >
              {isSubmitting && <Loader2 size={16} className="animate-spin" />}
              {isSubmitting ? "Processing..." : "Create Asset(s)"}
            </button>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirmClose}
        title="Discard Changes?"
      >
        <p>
          You have unsaved changes. Are you sure you want to discard them and
          close the window?
        </p>
      </ConfirmationModal>
    </>
  );
}
