import { X, AlertTriangle } from "lucide-react";

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  children,
}) {
  if (!isOpen) return null;

  return (
    // Backdrop
    <div
      onClick={onClose}
      // --- FIX: Increased z-index to render on top of the AddAssetModal ---
      className="fixed inset-0 z-60 bg-black/50 backdrop-blur-sm flex items-center justify-center"
    >
      {/* Modal Card */}
      <div
        onClick={(e) => e.stopPropagation()} // Prevent card click from closing
        className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6"
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-full">
              <AlertTriangle size={20} className="text-yellow-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Message */}
        <div className="mt-4 text-sm text-gray-600">{children}</div>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg"
          >
            Yes, Discard
          </button>
        </div>
      </div>
    </div>
  );
}
