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
// function OntRouterForm({ formData, setFormData, warehouseList }) {
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
//       <div>
//         <label
//           htmlFor="warehouseId"
//           className="block text-sm font-medium text-gray-700 mb-1"
//         >
//           Warehouse
//         </label>
//         <select
//           id="warehouseId"
//           name="warehouseId"
//           value={formData.warehouseId}
//           onChange={handleChange}
//           className="w-full text-sm border-gray-300 rounded-lg"
//         >
//           <option value="">Select a warehouse</option>
//           {warehouseList.map((w) => (
//             <option key={w.id} value={w.id}>
//               {w.address} (ID: {w.id})
//             </option>
//           ))}
//         </select>
//       </div>
//     </div>
//   );
// }
// // ... (SplitterForm component is unchanged from the version where it adds ONE splitter) ...
// function SplitterForm({ formData, setFormData, warehouseList }) {
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
//           htmlFor="warehouseId"
//           className="block text-sm font-medium text-gray-700 mb-1"
//         >
//           Warehouse
//         </label>
//         <select
//           id="warehouseId"
//           name="warehouseId"
//           value={formData.warehouseId}
//           onChange={handleChange}
//           className="w-full text-sm border-gray-300 rounded-lg"
//         >
//           <option value="">Select a warehouse</option>
//           {warehouseList.map((w) => (
//             <option key={w.id} value={w.id}>
//               {w.address} (ID: {w.id})
//             </option>
//           ))}
//         </select>
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
//   warehouseId: "",
//   ratio: "1:8",
//   selectedSplitters: [], // --- CHANGED: Was splitterGroups
//   pincode: "",
//   latitude: "",
//   longitude: "",
// };

// export default function AddAssetModal({
//   isOpen,
//   onClose,
//   warehouseList,
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
//       formData.warehouseId ||
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
//         return (
//           <OntRouterForm
//             formData={formData}
//             setFormData={setFormData}
//             warehouseList={warehouseList}
//           />
//         );
//       case "Splitter":
//         return (
//           <SplitterForm
//             formData={formData}
//             setFormData={setFormData}
//             warehouseList={warehouseList}
//           />
//         );
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

import { useState, useEffect } from "react";
import ConfirmationModal from "./ConfirmationModal";
import {
  X,
  UploadCloud,
  FileText,
  Trash2,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
} from "lucide-react";

// ... (OntRouterForm component is unchanged) ...
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
    </div>
  );
}
// ... (SplitterForm component is unchanged from the version where it adds ONE splitter) ...
function SplitterForm({ formData, setFormData }) {
  const ratios = ["1:8", "1:16", "1:32", "1:64"];

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
          placeholder="e.g., 1:8 Passive"
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

// --- REBUILT: Form for FDH (Assign Existing Splitters) ---
function FdhForm({ formData, setFormData, availableSplitters }) {
  const [splitterToAdd, setSplitterToAdd] = useState(""); // Holds the ID of splitter in dropdown

  const handleBaseChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Find which splitters are *not* yet selected
  const selectedIds = formData.selectedSplitters;
  const remainingSplitters = availableSplitters.filter(
    (s) => !selectedIds.includes(s.splitter_id)
  );

  // Get the full objects for the selected splitters
  const selectedSplittersList = formData.selectedSplitters
    .map((id) => availableSplitters.find((s) => s.splitter_id === id))
    .filter(Boolean); // filter(Boolean) removes any undefined

  // Calculate ports
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
    setSplitterToAdd(""); // Reset dropdown
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
      {/* FDH Base Fields */}
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
          onChange={handleBaseChange}
          className="w-full text-sm border-gray-300 rounded-lg"
          placeholder="e.g., Nokia FX-8"
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
          id="pincode"
          name="pincode"
          value={formData.pincode}
          onChange={handleBaseChange}
          className="w-full text-sm border-gray-300 rounded-lg"
          placeholder="e.g., 600001"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="latitude"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Latitude
          </label>
          <input
            type="text"
            id="latitude"
            name="latitude"
            value={formData.latitude}
            onChange={handleBaseChange}
            className="w-full text-sm border-gray-300 rounded-lg"
            placeholder="e.g., 13.0880"
          />
        </div>
        <div>
          <label
            htmlFor="longitude"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Longitude
          </label>
          <input
            type="text"
            id="longitude"
            name="longitude"
            value={formData.longitude}
            onChange={handleBaseChange}
            className="w-full text-sm border-gray-300 rounded-lg"
            placeholder="e.g., 80.2821"
          />
        </div>
      </div>

      {/* --- NEW SPLITTER ASSIGNMENT UI --- */}
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
        {availableSplitters.length === 0 && (
          <p className="text-xs text-gray-500">
            No unassigned splitters available in inventory.
          </p>
        )}
        {remainingSplitters.length === 0 && availableSplitters.length > 0 && (
          <p className="text-xs text-green-600">
            All available splitters have been selected.
          </p>
        )}

        {/* --- LIST OF SELECTED SPLITTERS --- */}
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
                <X size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Total Ports */}
        <div className="p-3 bg-gray-50 rounded-lg text-sm">
          Total Ports: <span className="font-bold text-lg">{totalPorts}</span>
        </div>
      </div>
    </div>
  );
}

// --- Main AddAssetModal Component ---

// --- MODIFIED: Updated initial state ---
const initialFormData = {
  model: "",
  serial: "",
  ratio: "1:8",
  selectedSplitters: [], // --- CHANGED: Was splitterGroups
  pincode: "",
  latitude: "",
  longitude: "",
};

export default function AddAssetModal({
  isOpen,
  onClose,
  availableSplitters, // --- NEW: Added prop
}) {
  const [mode, setMode] = useState("manual");
  const [assetType, setAssetType] = useState("ONT");
  const [formData, setFormData] = useState(initialFormData);
  const [file, setFile] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // --- MODIFIED: Updated dirty check ---
  useEffect(() => {
    if (
      formData.model ||
      formData.serial ||
      formData.pincode ||
      formData.latitude ||
      formData.longitude ||
      formData.selectedSplitters.length > 0 || // --- CHANGED
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
  };

  // ... (Close & Confirmation Logic is unchanged) ...
  const handleCloseRequest = () => {
    if (isDirty) {
      setShowConfirm(true);
    } else {
      performClose();
    }
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
    onClose();
  };

  // ... (handleSubmit logic is unchanged) ...
  const handleSubmit = () => {
    let submissionData = {
      assetType,
      mode,
    };

    if (mode === "manual") {
      submissionData.formData = formData;
    } else {
      submissionData.file = file;
    }

    console.log("Submitting:", submissionData);
    performClose();
  };

  // ... (CSV Drag & Drop Handlers are unchanged) ...
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
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === "text/csv") {
      setFile(droppedFile);
    } else {
      alert("Please drop a valid .csv file.");
    }
  };
  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile);
    } else {
      alert("Please select a valid .csv file.");
    }
  };

  // --- MODIFIED: renderManualForm ---
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
            availableSplitters={availableSplitters} // --- NEW: Pass prop
          />
        );
      default:
        return null;
    }
  };

  // ... (renderCsvForm is unchanged) ...
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
      <p className="text-xs text-gray-500">
        Note: The CSV must follow the required format for the selected asset
        type (<strong>{assetType}</strong>).
      </p>
    </div>
  );

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={handleCloseRequest}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center"
      >
        {/* --- MODIFIED: Fixed height modal --- */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl h-2/3 flex flex-col"
        >
          {/* Header (Unchanged) */}
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

          {/* --- MODIFIED: Scrollable Body --- */}
          <div className="p-6 space-y-5 overflow-y-auto flex-1">
            {/* Top Row: Mode Toggle & Asset Type */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Asset Type Dropdown */}
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

              {/* Mode Toggle */}
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

            {/* Dynamic Form Area */}
            <div className="pt-2">
              {mode === "manual" ? renderManualForm() : renderCsvForm()}
            </div>
          </div>

          {/* Footer (Unchanged) */}
          <div className="flex justify-end gap-3 p-4 bg-gray-50 border-t rounded-b-xl">
            <button
              onClick={handleCloseRequest}
              className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
            >
              Create Asset(s)
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal (Unchanged) */}
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
