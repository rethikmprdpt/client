import React, { useState, useEffect } from "react";
import { getAvailableAssets, swapAsset } from "../../api/assetApi.js";
import { Loader2, X, RefreshCw, ArrowRight } from "lucide-react";

const SwapAssetModal = ({ isOpen, onClose, onSuccess, currentAsset }) => {
  const [availableAssets, setAvailableAssets] = useState([]);
  const [selectedAssetId, setSelectedAssetId] = useState("");
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Fetch available replacements when modal opens
  useEffect(() => {
    if (isOpen && currentAsset) {
      const fetchReplacements = async () => {
        setIsLoadingList(true);
        setError("");
        try {
          const response = await getAvailableAssets(currentAsset.type);
          setAvailableAssets(response.data || []);
        } catch (err) {
          console.error("Failed to load assets:", err);
          setError("Failed to load available replacements.");
        } finally {
          setIsLoadingList(false);
        }
      };
      fetchReplacements();
    }
  }, [isOpen, currentAsset]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAssetId) return;

    setIsSubmitting(true);
    setError("");

    try {
      const payload = {
        old_asset_id: currentAsset.id,
        new_asset_id: parseInt(selectedAssetId, 10),
        reason: "Technician Swap",
      };

      await swapAsset(payload);
      onSuccess(); // Close and refresh
    } catch (err) {
      console.error("Swap failed:", err);
      setError(err.response?.data?.detail || "Swap failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !currentAsset) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md m-4">
        <div className="flex justify-between items-center p-6 border-b bg-blue-50 rounded-t-lg">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <RefreshCw size={20} className="text-blue-600" /> Swap Asset
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* Visual Representation of Swap */}
          <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-center">
              <p className="text-xs font-bold text-gray-500 uppercase">
                Current
              </p>
              <p className="font-mono font-medium text-red-600">
                {currentAsset.serial}
              </p>
              <p className="text-xs text-gray-500">{currentAsset.model}</p>
            </div>
            <ArrowRight className="text-gray-400" />
            <div className="text-center">
              <p className="text-xs font-bold text-gray-500 uppercase">New</p>
              <p className="font-mono font-medium text-green-600">
                {selectedAssetId
                  ? availableAssets.find((a) => a.asset_id == selectedAssetId)
                      ?.serial_number
                  : "???"}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Replacement ({currentAsset.type})
              </label>
              <select
                value={selectedAssetId}
                onChange={(e) => setSelectedAssetId(e.target.value)}
                required
                disabled={isLoadingList}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select an available asset...</option>
                {availableAssets.map((asset) => (
                  <option key={asset.asset_id} value={asset.asset_id}>
                    {asset.model} - {asset.serial_number}
                  </option>
                ))}
              </select>
              {isLoadingList && (
                <p className="text-xs text-gray-500 mt-1">Loading list...</p>
              )}
              {!isLoadingList && availableAssets.length === 0 && (
                <p className="text-xs text-red-500 mt-1">
                  No available assets of this type found.
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !selectedAssetId}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2 disabled:bg-blue-300"
            >
              {isSubmitting && <Loader2 size={16} className="animate-spin" />}
              Confirm Swap
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SwapAssetModal;
