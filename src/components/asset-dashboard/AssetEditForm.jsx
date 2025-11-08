import { useState } from "react";

export default function AssetEditForm({ asset, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    model: asset?.model || "",
    asset_type: asset?.asset_type || "ONT", // Default to ONT
    serial_number: asset?.serial_number || "",
    status: asset?.status || "Available",
    location: asset?.location || "", // Added location field
  });

  const handleSubmit = () => {
    // --- FIX: Validate new field names ---
    if (formData.model && formData.serial_number) {
      onSave(formData);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-4 space-y-3 pt-4 mt-4 border-t border-gray-200">
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1">
          Asset Model
        </label>
        <input
          type="text"
          // --- FIX: Use 'model' ---
          name="model"
          value={formData.model}
          onChange={handleChange}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter asset model"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1">
          Asset Type
        </label>
        <select
          // --- FIX: Use 'asset_type' ---
          name="asset_type"
          value={formData.asset_type}
          onChange={handleChange}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {/* --- FIX: Update options to match your data --- */}
          <option value="ONT">ONT</option>
          <option value="Router">Router</option>
          <option value="FDH">FDH</option>
          <option value="Splitter">Splitter</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1">
          Serial Number
        </label>
        <input
          type="text"
          // --- FIX: Use 'serial_number' ---
          name="serial_number"
          value={formData.serial_number}
          onChange={handleChange}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter serial number"
        />
      </div>

      {/* --- NEW: Added Location to the edit form --- */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1">
          Location
        </label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="e.g., Customer:1"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1">
          Status
        </label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="Available">Available</option>
          <option value="Assigned">Assigned</option>
          <option value="Faulty">Faulty</option>
        </select>
      </div>

      <div className="flex gap-2 pt-2">
        <button
          onClick={handleSubmit}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors text-sm"
        >
          Save
        </button>
        <button
          onClick={onCancel}
          className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded-lg transition-colors text-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
