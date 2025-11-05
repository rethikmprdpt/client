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

// --- Sub-Components for Manual Mode Forms ---

// Form for ONT / Router (Unchanged)
function OntRouterForm({ formData, setFormData, warehouseList }) {
  // ... (component code is unchanged) ...
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
          htmlFor="warehouseId"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Warehouse
        </label>
        <select
          id="warehouseId"
          name="warehouseId"
          value={formData.warehouseId}
          onChange={handleChange}
          className="w-full text-sm border-gray-300 rounded-lg"
        >
          <option value="">Select a warehouse</option>
          {warehouseList.map((w) => (
            <option key={w.id} value={w.id}>
              {w.address} (ID: {w.id})
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

// --- REBUILT: Form for Splitter (Single Create) ---
function SplitterForm({ formData, setFormData, warehouseList }) {
  const ratios = ["1:8", "1:16", "1:32", "1:64"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --- FIX: Removed batch validation logic ---

  return (
    <div className="space-y-4">
      {/* Model and Warehouse fields */}
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
          htmlFor="warehouseId"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Warehouse
        </label>
        <select
          id="warehouseId"
          name="warehouseId"
          value={formData.warehouseId}
          onChange={handleChange}
          className="w-full text-sm border-gray-300 rounded-lg"
        >
          <option value="">Select a warehouse</option>
          {warehouseList.map((w) => (
            <option key={w.id} value={w.id}>
              {w.address} (ID: {w.id})
            </option>
          ))}
        </select>
      </div>

      {/* --- FIX: Added single Serial Number input --- */}
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

      {/* Existing Ratio Selector */}
      <div className="space-y-2 pt-2">
        <label className="block text-sm font-medium text-gray-700">
          Select Splitter Ratio
        </label>
        <div className="flex flex-wrap gap-3">
          {ratios.map((ratio) => (
            <button
              key={ratio}
              type="button" // Prevent form submission
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

      {/* --- FIX: Removed Quantity, Textarea, and Validation block --- */}
    </div>
  );
}

// --- REBUILT: Form for FDH (Define New Splitters) ---
function FdhForm({ formData, setFormData }) {
  const ratios = ["1:8", "1:16", "1:32", "1:64"];

  const handleBaseChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGroupChange = (id, field, value) => {
    setFormData((prev) => ({
      ...prev,
      splitterGroups: prev.splitterGroups.map((group) =>
        group.id === id ? { ...group, [field]: value } : group
      ),
    }));
  };

  const handleAddGroup = () => {
    setFormData((prev) => ({
      ...prev,
      splitterGroups: [
        ...prev.splitterGroups,
        { id: crypto.randomUUID(), ratio: "1:8", quantity: 1 },
      ],
    }));
  };

  const handleRemoveGroup = (id) => {
    setFormData((prev) => ({
      ...prev,
      splitterGroups: prev.splitterGroups.filter((group) => group.id !== id),
    }));
  };

  // Calculate total ports
  const totalPorts = formData.splitterGroups.reduce((acc, group) => {
    const ratioNum = parseInt(group.ratio.split(":")[1], 10) || 0;
    const quantity = parseInt(group.quantity, 10) || 0;
    return acc + ratioNum * quantity;
  }, 0);

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

      {/* --- NEW: Dynamic Splitter Group Section --- */}
      <div className="space-y-3 pt-2">
        <label className="block text-sm font-medium text-gray-700">
          Splitters to add to this FDH
        </label>
        <div className="space-y-3">
          {formData.splitterGroups.map((group, index) => (
            <div
              key={group.id}
              className="flex items-center gap-2 p-2 border rounded-lg"
            >
              <select
                value={group.ratio}
                onChange={(e) =>
                  handleGroupChange(group.id, "ratio", e.target.value)
                }
                className="text-sm border-gray-300 rounded-lg"
              >
                {ratios.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              <label htmlFor={`qty-${index}`} className="text-sm">
                Qty:
              </label>
              <input
                type="number"
                id={`qty-${index}`}
                value={group.quantity}
                min="1"
                onChange={(e) =>
                  handleGroupChange(group.id, "quantity", e.target.value)
                }
                className="w-20 text-sm border-gray-300 rounded-lg"
              />
              <button
                type="button"
                onClick={() => handleRemoveGroup(group.id)}
                className="ml-auto p-1 text-red-500 hover:text-red-700"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={handleAddGroup}
          className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800"
        >
          <PlusCircle size={16} />
          Add Splitter Group
        </button>
        <div className="p-3 bg-gray-50 rounded-lg text-sm">
          Total Ports: <span className="font-bold text-lg">{totalPorts}</span>
        </div>
      </div>
    </div>
  );
}

// --- Main AddAssetModal Component ---

// --- MODIFIED: Removed batch fields ---
const initialFormData = {
  model: "",
  serial: "", // Used by ONT/Router/Splitter
  // serials: "", // Removed
  // quantity: 1, // Removed
  warehouseId: "",
  ratio: "1:8", // Used by Splitter
  splitterGroups: [], // Used by FDH
  pincode: "",
  latitude: "",
  longitude: "",
};

export default function AddAssetModal({
  isOpen,
  onClose, // This is the function to call to *request* a close
  warehouseList,
}) {
  const [mode, setMode] = useState("manual"); // 'manual' or 'csv'
  const [assetType, setAssetType] = useState("ONT");
  const [formData, setFormData] = useState(initialFormData);
  const [file, setFile] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // When form data changes, mark as dirty
  useEffect(() => {
    // --- MODIFIED: Updated dirty check ---
    if (
      formData.model ||
      formData.serial || // Now correctly covers Splitter
      // formData.serials || // Removed
      // (formData.quantity !== 1 && formData.quantity !== "") || // Removed
      formData.warehouseId ||
      formData.pincode ||
      formData.latitude ||
      formData.longitude ||
      formData.splitterGroups.length > 0 ||
      file
    ) {
      setIsDirty(true);
    } else {
      setIsDirty(false); // Reset if all fields are cleared
    }
  }, [formData, file]);

  // When asset type changes, reset the form
  const handleAssetTypeChange = (e) => {
    setAssetType(e.target.value);
    setFormData(initialFormData); // Reset form data
  };

  // --- Close & Confirmation Logic (Unchanged) ---
  const handleCloseRequest = () => {
    if (isDirty) {
      setShowConfirm(true); // Ask for confirmation
    } else {
      performClose(); // Close directly
    }
  };
  const handleConfirmClose = () => {
    // User confirmed to discard
    setShowConfirm(false);
    performClose();
  };

  const performClose = () => {
    // Reset all state on close
    setMode("manual");
    setAssetType("ONT");
    setFormData(initialFormData);
    setFile(null);
    setIsDirty(false);
    onClose(); // Call parent component's close function
  };

  // --- Form & File Submission Logic (Unchanged) ---
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
    // Here you would call your API
    // await AssetAPI.createAssetBatch(submissionData);
    performClose(); // Close after submission
  };

  // --- CSV Drag & Drop Handlers (Unchanged) ---
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

  // --- Dynamic Form Rendering ---
  const renderManualForm = () => {
    switch (assetType) {
      case "ONT":
      case "Router":
        return (
          <OntRouterForm
            formData={formData}
            setFormData={setFormData}
            warehouseList={warehouseList}
          />
        );
      case "Splitter":
        return (
          <SplitterForm
            formData={formData}
            setFormData={setFormData}
            warehouseList={warehouseList}
          />
        );
      case "FDH":
        return <FdhForm formData={formData} setFormData={setFormData} />;
      default:
        return null;
    }
  };

  // (renderCsvForm is unchanged)
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
        {/* Modal Card */}
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

          {/* Body (Unchanged) */}
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
