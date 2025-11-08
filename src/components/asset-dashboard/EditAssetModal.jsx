/* eslint-disable no-unused-vars */
// import { useState, useEffect } from "react";
// import ConfirmationModal from "./ConfirmationModal";
// import { X, PlusCircle } from "lucide-react";

// // --- Form Components ---
// // These are copies of the forms from AddAssetModal, modified for editing.

// function OntRouterEditForm({ asset, formData, setFormData, warehouseList }) {
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
//         />
//       </div>
//       <div>
//         <label
//           htmlFor="serial_number"
//           className="block text-sm font-medium text-gray-700 mb-1"
//         >
//           Serial Number
//         </label>
//         <input
//           type="text"
//           id="serial_number"
//           name="serial_number"
//           value={formData.serial_number}
//           onChange={handleChange}
//           className="w-full text-sm border-gray-300 rounded-lg"
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
//           value={formData.warehouseId || ""} // Handle null
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

// function SplitterEditForm({ asset, formData, setFormData, warehouseList }) {
//   const ratios = ["1:8", "1:16", "1:32", "1:64"];
//   const modelParts = formData.model.split(" "); // e.g., ["1:8", "Passive"]
//   const [ratio, setRatio] = useState(modelParts[0] || "1:8");

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleRatioChange = (newRatio) => {
//     setRatio(newRatio);
//     // Assumes model is like "1:8 Passive"
//     const newModel = `${newRatio} ${modelParts.slice(1).join(" ")}`.trim();
//     setFormData((prev) => ({ ...prev, model: newModel }));
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
//           htmlFor="serial_number"
//           className="block text-sm font-medium text-gray-700 mb-1"
//         >
//           Serial Number
//         </label>
//         <input
//           type="text"
//           id="serial_number"
//           name="serial_number"
//           value={formData.serial_number}
//           onChange={handleChange}
//           className="w-full text-sm border-gray-300 rounded-lg"
//         />
//       </div>
//       <div>
//         <label
//           htmlFor="warehouseId"
//           className="block text-sm font-medium text-gray-700 mb-1"
//         >
//           Warehouse (if not in FDH)
//         </label>
//         <select
//           id="warehouseId"
//           name="warehouseId"
//           value={formData.warehouseId || ""} // Handle null
//           onChange={handleChange}
//           disabled={!!asset.originalData.fdh_id} // Disable if in FDH
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
//       <div className="space-y-2 pt-2">
//         <label className="block text-sm font-medium text-gray-700">
//           Splitter Ratio
//         </label>
//         <div className="flex flex-wrap gap-3">
//           {ratios.map((r) => (
//             <button
//               key={r}
//               type="button"
//               onClick={() => handleRatioChange(r)}
//               className={`px-4 py-2 rounded-lg text-sm font-semibold ${
//                 ratio === r
//                   ? "bg-blue-600 text-white"
//                   : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//               }`}
//             >
//               {r}
//             </button>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// function FdhEditForm({ asset, formData, setFormData, availableSplitters }) {
//   const [splitterToAdd, setSplitterToAdd] = useState("");

//   const handleBaseChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   // Find splitters assigned to *this* FDH (from original data)
//   const assignedSplitterIds = (asset.originalData.splitters || []).map(
//     (s) => s.splitter_id
//   );

//   // Splitters in the dropdown = unassigned splitters
//   const remainingSplitters = availableSplitters.filter(
//     (s) => s.fdh_id === null
//   );

//   // List of selected splitters = (original + newly added)
//   // This logic is complex and needs API support.
//   // For now, we just edit the FDH's own fields.
//   // The logic to add/remove splitters should be a separate "Manage FDH" feature.

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
//           onChange={handleBaseChange}
//           className="w-full text-sm border-gray-300 rounded-lg"
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
//           />
//         </div>
//       </div>
//       <div className="pt-2">
//         <label className="block text-sm font-medium text-gray-700">
//           Assigned Splitters
//         </label>
//         <p className="text-xs text-gray-500 mb-2">
//           Note: Adding/removing splitters must be done from the Splitter's edit
//           page.
//         </p>
//         <div className="space-y-2 h-32 overflow-y-auto p-2 bg-gray-50 rounded-lg border">
//           {(asset.originalData.splitters || []).length === 0 ? (
//             <p className="text-sm text-gray-400">No splitters assigned.</p>
//           ) : (
//             (asset.originalData.splitters || []).map((s) => (
//               <div
//                 key={s.splitter_id}
//                 className="p-2 bg-white rounded shadow-sm text-sm"
//               >
//                 {s.model} (ID: {s.splitter_id})
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// // --- Main EditAssetModal Component ---

// export default function EditAssetModal({
//   isOpen,
//   onClose,
//   onSave,
//   asset, // The asset to edit
//   warehouseList,
//   availableSplitters,
// }) {
//   const [formData, setFormData] = useState({});
//   const [isDirty, setIsDirty] = useState(false);
//   const [showConfirm, setShowConfirm] = useState(false);

//   // When the modal opens or the asset changes, pre-fill the form
//   useEffect(() => {
//     if (asset) {
//       // Use originalData for a clean state
//       setFormData(asset.originalData);
//       setIsDirty(false); // Reset dirty state
//     }
//   }, [asset]);

//   // Track if form has been changed
//   useEffect(() => {
//     if (
//       asset &&
//       JSON.stringify(formData) !== JSON.stringify(asset.originalData)
//     ) {
//       setIsDirty(true);
//     }
//   }, [formData, asset]);

//   const handleCloseRequest = () => {
//     if (isDirty) {
//       setShowConfirm(true); // Ask for confirmation
//     } else {
//       onClose(); // Close directly
//     }
//   };

//   const handleConfirmClose = () => {
//     setShowConfirm(false);
//     onClose();
//   };

//   const handleSubmit = () => {
//     // Pass only the changed data back
//     onSave(formData);
//   };

//   // --- Dynamic Form Rendering ---
//   const renderEditForm = () => {
//     if (!asset) return null;

//     switch (asset.type) {
//       case "ONT":
//       case "Router":
//         return (
//           <OntRouterEditForm
//             asset={asset}
//             formData={formData}
//             setFormData={setFormData}
//             warehouseList={warehouseList}
//           />
//         );
//       case "Splitter":
//         return (
//           <SplitterEditForm
//             asset={asset}
//             formData={formData}
//             setFormData={setFormData}
//             warehouseList={warehouseList}
//           />
//         );
//       case "FDH":
//         return (
//           <FdhEditForm
//             asset={asset}
//             formData={formData}
//             setFormData={setFormData}
//             availableSplitters={availableSplitters}
//           />
//         );
//       default:
//         return <p>This asset type cannot be edited.</p>;
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <>
//       {/* Backdrop */}
//       <div
//         onClick={handleCloseRequest}
//         className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center"
//       >
//         {/* Modal Card */}
//         <div
//           onClick={(e) => e.stopPropagation()}
//           className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl h-2/3 flex flex-col"
//         >
//           {/* Header */}
//           <div className="flex items-center justify-between p-4 border-b">
//             <h3 className="text-lg font-semibold text-gray-900">
//               Edit {asset?.type}: {asset?.model} (ID: {asset?.id})
//             </h3>
//             <button
//               onClick={handleCloseRequest}
//               className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
//             >
//               <X size={20} />
//             </button>
//           </div>

//           {/* Scrollable Body */}
//           <div className="p-6 space-y-5 overflow-y-auto flex-1">
//             {renderEditForm()}
//           </div>

//           {/* Footer */}
//           <div className="flex justify-end gap-3 p-4 bg-gray-50 border-t rounded-b-xl">
//             <button
//               onClick={handleCloseRequest}
//               className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleSubmit}
//               disabled={!isDirty}
//               className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:bg-gray-400"
//             >
//               Save Changes
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Confirmation Modal */}
//       <ConfirmationModal
//         isOpen={showConfirm}
//         onClose={() => setShowConfirm(false)}
//         onConfirm={handleConfirmClose}
//         title="Discard Changes?"
//       >
//         <p>You have unsaved changes. Are you sure you want to discard them?</p>
//       </ConfirmationModal>
//     </>
//   );
// }

import { useState, useEffect } from "react";
import ConfirmationModal from "./ConfirmationModal";
import { X, PlusCircle } from "lucide-react";

// --- Form Components ---
// These are copies of the forms from AddAssetModal, modified for editing.

function OntRouterEditForm({ asset, formData, setFormData }) {
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
        />
      </div>
      <div>
        <label
          htmlFor="serial_number"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Serial Number
        </label>
        <input
          type="text"
          id="serial_number"
          name="serial_number"
          value={formData.serial_number}
          onChange={handleChange}
          className="w-full text-sm border-gray-300 rounded-lg"
        />
      </div>
    </div>
  );
}

function SplitterEditForm({ asset, formData, setFormData }) {
  const ratios = ["1:8", "1:16", "1:32", "1:64"];
  const modelParts = formData.model.split(" "); // e.g., ["1:8", "Passive"]
  const [ratio, setRatio] = useState(modelParts[0] || "1:8");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRatioChange = (newRatio) => {
    setRatio(newRatio);
    // Assumes model is like "1:8 Passive"
    const newModel = `${newRatio} ${modelParts.slice(1).join(" ")}`.trim();
    setFormData((prev) => ({ ...prev, model: newModel }));
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
          htmlFor="serial_number"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Serial Number
        </label>
        <input
          type="text"
          id="serial_number"
          name="serial_number"
          value={formData.serial_number}
          onChange={handleChange}
          className="w-full text-sm border-gray-300 rounded-lg"
        />
      </div>
      <div className="space-y-2 pt-2">
        <label className="block text-sm font-medium text-gray-700">
          Splitter Ratio
        </label>
        <div className="flex flex-wrap gap-3">
          {ratios.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => handleRatioChange(r)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                ratio === r
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function FdhEditForm({ asset, formData, setFormData, availableSplitters }) {
  const [splitterToAdd, setSplitterToAdd] = useState("");

  const handleBaseChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Find splitters assigned to *this* FDH (from original data)
  const assignedSplitterIds = (asset.originalData.splitters || []).map(
    (s) => s.splitter_id
  );

  // Splitters in the dropdown = unassigned splitters
  const remainingSplitters = availableSplitters.filter(
    (s) => s.fdh_id === null
  );

  // List of selected splitters = (original + newly added)
  // This logic is complex and needs API support.
  // For now, we just edit the FDH's own fields.
  // The logic to add/remove splitters should be a separate "Manage FDH" feature.

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
          onChange={handleBaseChange}
          className="w-full text-sm border-gray-300 rounded-lg"
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
          />
        </div>
      </div>
      <div className="pt-2">
        <label className="block text-sm font-medium text-gray-700">
          Assigned Splitters
        </label>
        <p className="text-xs text-gray-500 mb-2">
          Note: Adding/removing splitters must be done from the Splitter's edit
          page.
        </p>
        <div className="space-y-2 h-32 overflow-y-auto p-2 bg-gray-50 rounded-lg border">
          {(asset.originalData.splitters || []).length === 0 ? (
            <p className="text-sm text-gray-400">No splitters assigned.</p>
          ) : (
            (asset.originalData.splitters || []).map((s) => (
              <div
                key={s.splitter_id}
                className="p-2 bg-white rounded shadow-sm text-sm"
              >
                {s.model} (ID: {s.splitter_id})
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// --- Main EditAssetModal Component ---

export default function EditAssetModal({
  isOpen,
  onClose,
  onSave,
  asset, // The asset to edit
  availableSplitters,
}) {
  const [formData, setFormData] = useState({});
  const [isDirty, setIsDirty] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // When the modal opens or the asset changes, pre-fill the form
  useEffect(() => {
    if (asset) {
      // Use originalData for a clean state
      setFormData(asset.originalData);
      setIsDirty(false); // Reset dirty state
    }
  }, [asset]);

  // Track if form has been changed
  useEffect(() => {
    if (
      asset &&
      JSON.stringify(formData) !== JSON.stringify(asset.originalData)
    ) {
      setIsDirty(true);
    }
  }, [formData, asset]);

  const handleCloseRequest = () => {
    if (isDirty) {
      setShowConfirm(true); // Ask for confirmation
    } else {
      onClose(); // Close directly
    }
  };

  const handleConfirmClose = () => {
    setShowConfirm(false);
    onClose();
  };

  const handleSubmit = () => {
    // Pass only the changed data back
    onSave(formData);
  };

  // --- Dynamic Form Rendering ---
  const renderEditForm = () => {
    if (!asset) return null;

    switch (asset.type) {
      case "ONT":
      case "Router":
        return (
          <OntRouterEditForm
            asset={asset}
            formData={formData}
            setFormData={setFormData}
          />
        );
      case "Splitter":
        return (
          <SplitterEditForm
            asset={asset}
            formData={formData}
            setFormData={setFormData}
          />
        );
      case "FDH":
        return (
          <FdhEditForm
            asset={asset}
            formData={formData}
            setFormData={setFormData}
            availableSplitters={availableSplitters}
          />
        );
      default:
        return <p>This asset type cannot be edited.</p>;
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={handleCloseRequest}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center"
      >
        {/* Modal Card */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl h-2/3 flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-semibold text-gray-900">
              Edit {asset?.type}: {asset?.model} (ID: {asset?.id})
            </h3>
            <button
              onClick={handleCloseRequest}
              className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="p-6 space-y-5 overflow-y-auto flex-1">
            {renderEditForm()}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-4 bg-gray-50 border-t rounded-b-xl">
            <button
              onClick={handleCloseRequest}
              className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!isDirty}
              className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:bg-gray-400"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirmClose}
        title="Discard Changes?"
      >
        <p>You have unsaved changes. Are you sure you want to discard them?</p>
      </ConfirmationModal>
    </>
  );
}
