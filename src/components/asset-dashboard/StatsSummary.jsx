// // export default function StatsSummary({ assets }) {
// //   return (
// //     <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
// //       <h3 className="text-sm font-bold text-gray-700 mb-3">Filtered Summary</h3>
// //       <div className="space-y-2">
// //         <div className="flex justify-between items-center">
// //           <span className="text-xs text-gray-600">Total</span>
// //           <span className="text-sm font-bold text-gray-900">
// //             {assets.length}
// //           </span>
// //         </div>
// //         <div className="flex justify-between items-center">
// //           <span className="text-xs text-green-600">Available</span>
// //           <span className="text-sm font-bold text-green-700">
// //             {assets.filter((a) => a.status === "Available").length}
// //           </span>
// //         </div>
// //         <div className="flex justify-between items-center">
// //           <span className="text-xs text-yellow-600">Assigned</span>
// //           <span className="text-sm font-bold text-yellow-700">
// //             {assets.filter((a) => a.status === "Assigned").length}
// //           </span>
// //         </div>
// //         <div className="flex justify-between items-center">
// //           <span className="text-xs text-red-600">Faulty</span>
// //           <span className="text-sm font-bold text-red-700">
// //             {assets.filter((a) => a.status === "Faulty").length}
// //           </span>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// import { useMemo } from "react";
// import { Server, Monitor, Wifi, Package } from "lucide-react";

// // A small component for each stat item
// function StatItem({ icon, label, value, color }) {
//   return (
//     <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
//       <div className="flex items-center gap-3">
//         <div className={`p-2 rounded-lg ${color}`}>{icon}</div>
//         <span className="text-sm font-medium text-gray-700">{label}</span>
//       </div>
//       <span className="text-lg font-semibold text-gray-900">{value}</span>
//     </div>
//   );
// }

// export default function StatsSummary({ assets }) {
//   // useMemo will prevent recalculating on every render
//   // It only recalculates when the 'assets' prop changes
//   const stats = useMemo(() => {
//     return {
//       total: assets.length,
//       onts: assets.filter((a) => a.type === "ONT").length,
//       routers: assets.filter((a) => a.type === "Router").length,
//       fdhs: assets.filter((a) => a.type === "FDH").length,
//       splitters: assets.filter((a) => a.type === "Splitter").length,
//     };
//   }, [assets]);

//   return (
//     <div className="sticky top-6 space-y-3">
//       <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
//         Filtered Summary
//       </h3>

//       <div className="flex items-center justify-between p-4 bg-blue-600 text-white rounded-lg shadow">
//         <span className="text-sm font-semibold uppercase">Total Assets</span>
//         <span className="text-3xl font-bold">{stats.total}</span>
//       </div>

//       <div className="space-y-2">
//         <StatItem
//           icon={<Monitor size={18} className="text-green-700" />}
//           label="ONTs"
//           value={stats.onts}
//           color="bg-green-100"
//         />
//         <StatItem
//           icon={<Wifi size={18} className="text-blue-700" />}
//           label="Routers"
//           value={stats.routers}
//           color="bg-blue-100"
//         />
//         <StatItem
//           icon={<Server size={18} className="text-purple-700" />}
//           label="FDHs"
//           value={stats.fdhs}
//           color="bg-purple-100"
//         />
//         <StatItem
//           icon={<Package size={18} className="text-yellow-700" />}
//           label="Splitters"
//           value={stats.splitters}
//           color="bg-yellow-100"
//         />
//       </div>
//     </div>
//   );
// }

import { useMemo } from "react";
import {
  Server, // Asset type icon
  Monitor, // Asset type icon
  Wifi, // Asset type icon
  Package, // Asset type icon
  User, // Assigned status
  CheckCircle, // Available status
  XCircle, // Faulty status
  MinusCircle, // Retired status
  Info, // Active status (for FDH)
} from "lucide-react";

/**
 * NEW: A small component for individual status icons
 * It won't render if the count is 0.
 */
function StatusIcon({ icon, count, colorClass, label }) {
  if (count === 0) return null; // Don't show if count is zero
  return (
    <div
      className={`flex items-center gap-1 ${colorClass}`}
      title={`${count} ${label}`}
    >
      {icon}
      <span className="text-xs font-semibold">{count}</span>
    </div>
  );
}

/**
 * MODIFIED: Renamed from StatItem to StatCard
 * This now shows the total count and the status breakdown.
 */
function StatCard({ icon, label, stats, color }) {
  return (
    <div className="flex flex-col p-3 bg-white rounded-lg border border-gray-200 gap-2 shadow-sm">
      {/* Top part: Total count (similar to before) */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${color}`}>{icon}</div>
          <span className="text-sm font-medium text-gray-700">{label}</span>
        </div>
        <span className="text-lg font-semibold text-gray-900">
          {stats.total}
        </span>
      </div>

      {/* NEW: Bottom part: Status breakdown */}
      {/* This section only appears if there are any statuses to show */}
      {(stats.assigned > 0 ||
        stats.available > 0 ||
        stats.faulty > 0 ||
        stats.retired > 0 ||
        stats.active > 0) && (
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
          <StatusIcon
            icon={<User size={14} />}
            count={stats.assigned}
            colorClass="text-yellow-600"
            label="Assigned"
          />
          <StatusIcon
            icon={<CheckCircle size={14} />}
            count={stats.available}
            colorClass="text-green-600"
            label="Available"
          />
          <StatusIcon
            icon={<XCircle size={14} />}
            count={stats.faulty}
            colorClass="text-red-600"
            label="Faulty"
          />
          <StatusIcon
            icon={<MinusCircle size={14} />}
            count={stats.retired}
            colorClass="text-gray-500"
            label="Retired"
          />
          <StatusIcon
            icon={<Info size={14} />}
            count={stats.active}
            colorClass="text-blue-600"
            label="Active"
          />
        </div>
      )}
    </div>
  );
}

/**
 * NEW: Helper function to calculate detailed stats for a specific asset type.
 */
function calculateStatsByType(assets, type) {
  const stats = {
    total: 0,
    assigned: 0,
    available: 0,
    faulty: 0,
    retired: 0,
    active: 0, // For FDHs
  };

  // Loop through all filtered assets
  for (const asset of assets) {
    if (asset.type === type) {
      stats.total++;
      const status = asset.status?.toLowerCase();

      switch (status) {
        case "assigned":
          stats.assigned++;
          break;
        case "available":
          stats.available++;
          break;
        case "faulty":
          stats.faulty++;
          break;
        case "retired":
          stats.retired++;
          break;
        case "active":
          stats.active++;
          break;
        default:
          break;
      }
    }
  }
  return stats;
}

export default function StatsSummary({ assets }) {
  // useMemo now calculates the detailed breakdown for each type.
  const stats = useMemo(() => {
    return {
      total: assets.length,
      onts: calculateStatsByType(assets, "ONT"),
      routers: calculateStatsByType(assets, "Router"),
      fdhs: calculateStatsByType(assets, "FDH"),
      splitters: calculateStatsByType(assets, "Splitter"),
    };
  }, [assets]);

  return (
    <div className="sticky top-6 space-y-3">
      <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
        Filtered Summary
      </h3>

      {/* Total Card */}
      <div className="flex items-center justify-between p-4 bg-blue-600 text-white rounded-lg shadow">
        <span className="text-sm font-semibold uppercase">Total Assets</span>
        <span className="text-3xl font-bold">{stats.total}</span>
      </div>

      {/* Breakdown Cards */}
      <div className="space-y-2">
        <StatCard
          icon={<Monitor size={18} className="text-green-700" />}
          label="ONTs"
          stats={stats.onts} // Pass the whole stats object for ONTs
          color="bg-green-100"
        />
        <StatCard
          icon={<Wifi size={18} className="text-blue-700" />}
          label="Routers"
          stats={stats.routers} // Pass the whole stats object for Routers
          color="bg-blue-100"
        />
        <StatCard
          icon={<Server size={18} className="text-purple-700" />}
          label="FDHs"
          stats={stats.fdhs} // Pass the whole stats object for FDHs
          color="bg-purple-100"
        />
        <StatCard
          icon={<Package size={18} className="text-yellow-700" />}
          label="Splitters"
          stats={stats.splitters} // Pass the whole stats object for Splitters
          color="bg-yellow-100"
        />
      </div>
    </div>
  );
}
