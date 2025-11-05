// import { useRef } from "react";
// import {
//   Edit,
//   Trash2,
//   Server,
//   Laptop,
//   Monitor,
//   Wifi,
//   Package, // Using Package for Splitter/FDH
// } from "lucide-react";
// import AssetEditForm from "./AssetEditForm";

// // --- FIX: Removed 'users' prop ---
// function AssetDetailView({ asset }) {
//   // const assignedUser = users.find((u) => u.id === asset.user_id); // --- FIX: Removed

//   const detailItems = [
//     { label: "Location", value: asset.location || "N/A" },
//     // --- FIX: 'Assigned User' is redundant, location shows this.
//     // --- FIX: Use 'serial_number' ---
//     { label: "Serial Number", value: asset.serial_number || "N/A" },
//   ];

//   return (
//     <div className="p-4 pt-4 mt-4 border-t border-gray-200">
//       <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">
//         Asset Details
//       </h4>
//       <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
//         {detailItems.map((item) => (
//           <div key={item.label} className="text-sm">
//             <dt className="font-semibold text-gray-800">{item.label}</dt>
//             <dd className="text-gray-600 truncate">{item.value}</dd>
//           </div>
//         ))}
//       </dl>
//     </div>
//   );
// }

// export default function AssetRow({
//   asset,
//   isEditing,
//   isSelected,
//   onEdit,
//   onSave,
//   onCancel,
//   onDelete,
//   onSelect,
// }) {
//   const rowRef = useRef(null);

//   const getIcon = (type) => {
//     const iconProps = { size: 18, className: "text-gray-600" };
//     switch (type) {
//       case "Router":
//         return <Wifi {...iconProps} />;
//       case "ONT":
//         return <Monitor {...iconProps} />; // Represents a user-facing device
//       case "FDH":
//         return <Server {...iconProps} />; // Represents a network cabinet
//       case "Splitter":
//         return <Package {...iconProps} />; // Represents a smaller component
//       default:
//         return <Server {...iconProps} />;
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "Available":
//         return "bg-green-100 text-green-800 border-green-300";
//       case "Assigned":
//         return "bg-yellow-100 text-yellow-800 border-yellow-300";
//       case "Faulty":
//         return "bg-red-100 text-red-800 border-red-300";
//       default:
//         return "bg-gray-100 text-gray-800 border-gray-300";
//     }
//   };

//   const getRowBorderColor = (status) => {
//     switch (status) {
//       case "Available":
//         return "border-l-green-500";
//       case "Assigned":
//         return "border-l-yellow-500";
//       case "Faulty":
//         return "border-l-red-500";
//       default:
//         return "border-l-gray-300";
//     }
//   };

//   return (
//     <div
//       ref={rowRef}
//       className={`bg-white border-l-4 border border-gray-200 rounded-lg p-3 transition-all ${
//         isEditing
//           ? "shadow-lg ring-2 ring-blue-500"
//           : isSelected
//           ? "shadow-md"
//           : "hover:shadow-md"
//       } ${getRowBorderColor(asset.status)}`}
//     >
//       {/* This is the main, clickable, read-only view */}
//       <div
//         className="flex items-center justify-between gap-4 cursor-pointer"
//         // --- FIX: Pass asset_id on select ---
//         onClick={() => onSelect(asset.asset_id)}
//       >
//         <div className="flex items-center gap-3 flex-1 min-w-0">
//           <div className="shrink-0">{getIcon(asset.asset_type)}</div>
//           <div className="flex-1 min-w-0">
//             <h3 className="font-semibold text-gray-900 text-sm truncate">
//               {asset.model}
//             </h3>
//             <p className="text-xs text-gray-500">
//               {asset.asset_type} · {asset.serial_number}
//             </p>
//           </div>
//         </div>

//         <div className="flex items-center gap-3">
//           <span
//             className={`px-2 py-1 rounded text-xs font-semibold border ${getStatusColor(
//               asset.status
//             )}`}
//           >
//             {asset.status}
//           </span>
//           <div className="flex gap-1">
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 onEdit(asset);
//               }}
//               // ... (rest of button is unchanged)
//             >
//               <Edit size={16} />
//             </button>
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 // --- FIX: Pass asset_id on delete ---
//                 onDelete(asset.asset_id);
//               }}
//               // ... (rest of button is unchanged)
//             >
//               <Trash2 size={16} />
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* --- NEW: Conditionally render the DETAIL view --- */}
//       {/* --- FIX: Pass asset (users prop removed) --- */}
//       {isSelected && <AssetDetailView asset={asset} />}

//       {isEditing && (
//         <AssetEditForm asset={asset} onSave={onSave} onCancel={onCancel} />
//       )}
//     </div>
//   );
// }

import {
  Edit,
  Trash2,
  Server, // For FDH
  Monitor, // For ONT
  Wifi, // For Router
  Package, // For Splitter
} from "lucide-react";

// --- NEW: Smart Detail View ---
function AssetDetailView({ asset }) {
  const data = asset.originalData;
  let details = [];

  // Define details based on asset type
  if (asset.type === "ONT" || asset.type === "Router") {
    details = [
      {
        label: "Assigned Customer",
        value: data.customer ? data.customer.name : "Unassigned",
      },
      {
        label: "Customer ID",
        value: data.assigned_to_customer_id || "N/A",
      },
      {
        label: "Stored at Warehouse",
        value: data.warehouse ? data.warehouse.address : "N/A (In Field)",
      },
      { label: "Warehouse ID", value: data.stored_at_warehouse_id || "N/A" },
      { label: "Port ID", value: data.port_id || "N/A" },
      { label: "Pincode", value: data.pincode || "N/A" },
    ];
  } else if (asset.type === "FDH") {
    details = [
      { label: "Pincode", value: data.pincode || "N/A" },
      { label: "FDH ID", value: data.fdh_id },
      { label: "Latitude", value: data.latitude },
      { label: "Longitude", value: data.longitude },
    ];
  } else if (asset.type === "Splitter") {
    details = [
      { label: "Splitter ID", value: data.splitter_id },
      { label: "Parent FDH ID", value: data.fdh_id },
      { label: "Model", value: data.model },
      { label: "Ports Used", value: `${data.used_ports} / ${data.max_ports}` },
    ];
  }

  return (
    <div className="p-4 pt-4 mt-4 border-t border-gray-200">
      <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">
        {asset.type} Details
      </h4>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
        {details.map((item) => (
          <div key={item.label} className="text-sm">
            <dt className="font-semibold text-gray-800">{item.label}</dt>
            <dd className="text-gray-600 truncate">{item.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

// --- Main AssetRow Component ---
export default function AssetRow({
  asset, // The new NORMALIZED asset
  isSelected,
  onSelect,
}) {
  // Helper function for status badge color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "available":
        return "bg-green-100 text-green-800 border-green-300";
      case "assigned":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "faulty":
        return "bg-red-100 text-red-800 border-red-300";
      case "active": // For FDHs
        return "bg-blue-100 text-blue-800 border-blue-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  // Helper function for the row's left border color
  const getRowBorderColor = (status) => {
    switch (status?.toLowerCase()) {
      case "available":
        return "border-l-green-500";
      case "assigned":
        return "border-l-yellow-500";
      case "faulty":
        return "border-l-red-500";
      case "active": // For FDHs
        return "border-l-blue-500";
      default:
        return "border-l-gray-300";
    }
  };

  // Helper function for the asset type icon
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

  return (
    <div
      className={`bg-white border-l-4 border border-gray-200 rounded-lg p-3 transition-all ${
        isSelected ? "shadow-md" : "hover:shadow-md"
      } ${getRowBorderColor(asset.status)}`}
    >
      {/* This is the main, clickable, read-only view */}
      <div
        className="flex items-center justify-between gap-4 cursor-pointer"
        onClick={() => onSelect(asset.id)} // Click handler for expansion
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
          <span
            className={`px-2 py-1 rounded text-xs font-semibold border capitalize ${getStatusColor(
              asset.status
            )}`}
          >
            {asset.status}
          </span>
          {/* Edit/Delete buttons are hidden for now.
            <div className="flex gap-1">
              <button ...><Edit size={16} /></button>
              <button ...><Trash2 size={16} /></button>
            </div>
          */}
        </div>
      </div>

      {/* Conditionally render the DETAIL view */}
      {isSelected && <AssetDetailView asset={asset} />}
    </div>
  );
}
