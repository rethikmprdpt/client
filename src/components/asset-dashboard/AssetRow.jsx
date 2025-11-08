import {
  Server,
  Package,
  Monitor,
  Wifi,
  ChevronRight,
  ChevronDown,
  Edit,
  Trash2,
  Lock, // Added Lock icon for assigned assets
} from "lucide-react";

// --- AssetDetailView ---
// Shows expanded details and (conditionally) Edit/Delete buttons
function AssetDetailView({ asset, onEdit, onDelete }) {
  let details = [];
  let locationInfo = null;
  const isAssigned = asset.status?.toLowerCase() === "assigned";

  // Set details based on asset type
  switch (asset.type) {
    case "ONT":
    case "Router":
      details = [
        { label: "Serial Number", value: asset.serial },
        { label: "Status", value: asset.status },
      ];
      if (asset.customerId) {
        locationInfo = `Assigned to Customer ID: ${asset.customerId}`;
      }
      break;
    case "FDH":
      details = [
        { label: "Pincode", value: asset.originalData.pincode },
        {
          label: "Location",
          value: `Lat: ${asset.originalData.latitude}, Lng: ${asset.originalData.longitude}`,
        },
      ];
      break;
    case "Splitter":
      details = [
        { label: "Status", value: asset.status },
        { label: "Max Ports", value: asset.originalData.max_ports },
        { label: "Used Ports", value: asset.originalData.used_ports },
      ];
      if (asset.originalData.fdh_id) {
        locationInfo = `Assigned to FDH ID: ${asset.originalData.fdh_id}`;
      } else {
        locationInfo = "Unassigned";
      }
      break;
    default:
      break;
  }

  return (
    <div className="p-4 pt-4 mt-4 border-t border-gray-200">
      <div className="flex justify-between items-start">
        {/* Details Section */}
        <div>
          <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">
            Asset Details
          </h4>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
            {details.map((item) => (
              <div key={item.label} className="text-sm">
                <dt className="font-semibold text-gray-800">{item.label}</dt>
                <dd className="text-gray-600 truncate">{item.value}</dd>
              </div>
            ))}
            {locationInfo && (
              <div className="text-sm col-span-2">
                <dt className="font-semibold text-gray-800">Location</dt>
                <dd className="text-gray-600 truncate">{locationInfo}</dd>
              </div>
            )}
          </dl>
        </div>

        {/* --- MODIFIED: Edit/Delete Button Group --- */}
        <div className="flex flex-col gap-2 w-32 shrink-0">
          {isAssigned ? (
            // If assigned, show a locked message
            <div className="flex items-center gap-2 text-left px-3 py-2 text-sm font-semibold text-gray-500 bg-gray-100 rounded-lg">
              <Lock size={16} />
              <span>Assigned assets cannot be modified.</span>
            </div>
          ) : (
            // If not assigned, show the buttons
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(asset);
                }}
                className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg"
              >
                <Edit size={16} />
                Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(asset);
                }}
                className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Main AssetRow Component ---
export default function AssetRow({
  asset,
  isSelected,
  onSelect,
  onEdit, // Prop for editing
  onDelete, // Prop for deleting
}) {
  // Helper for Icon
  const getIcon = (type) => {
    const iconProps = { size: 18, className: "text-gray-600" };
    switch (type) {
      case "Router":
        return <Wifi {...iconProps} />;
      case "ONT":
        return <Monitor {...iconProps} />;
      case "FDH":
        return <Server {...iconProps} />;
      case "Splitter":
        return <Package {...iconProps} />;
      default:
        return <Server {...iconProps} />;
    }
  };

  // Helper for Left Border Color
  const getStatusBorderColor = (status) => {
    switch (status?.toLowerCase()) {
      case "available":
        return "border-l-green-500";
      case "assigned":
      case "in_use":
      case "active":
        return "border-l-blue-500";
      case "faulty":
      case "offline":
        return "border-l-red-500";
      case "retired":
        return "border-l-gray-500";
      default:
        return "border-l-gray-300";
    }
  };

  // --- NEW: Helper for Status Badge Color (the "glow") ---
  const getStatusBadgeColor = (status) => {
    switch (status?.toLowerCase()) {
      case "available":
        return "bg-green-100 text-green-800 border-green-300";
      case "assigned":
      case "in_use":
      case "active":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "faulty":
      case "offline":
        return "bg-red-100 text-red-800 border-red-300";
      case "retired":
        return "bg-gray-100 text-gray-700 border-gray-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  return (
    <div
      className={`bg-white border-l-4 border border-gray-200 rounded-lg p-3 transition-all ${
        isSelected ? "shadow-md ring-1 ring-blue-500" : "hover:shadow-md"
      } ${getStatusBorderColor(asset.status)}`}
    >
      {/* Clickable Header */}
      <div
        className="flex items-center justify-between gap-4 cursor-pointer"
        onClick={() => onSelect(asset.id)}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="shrink-0">{getIcon(asset.type)}</div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-sm truncate">
              {asset.model}
            </h3>
            <p className="text-xs text-gray-500">
              {asset.type} · {asset.serial}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* --- FIX: Applied the badge color function --- */}
          <span
            className={`px-2 py-1 rounded text-xs font-semibold border ${getStatusBadgeColor(
              asset.status
            )}`}
          >
            {asset.status}
          </span>
          {isSelected ? (
            <ChevronDown size={18} className="text-gray-500" />
          ) : (
            <ChevronRight size={18} className="text-gray-500" />
          )}
        </div>
      </div>

      {/* Expandable Detail View */}
      {isSelected && (
        <AssetDetailView
          asset={asset}
          onEdit={onEdit} // Pass handlers
          onDelete={onDelete} // Pass handlers
        />
      )}
    </div>
  );
}
