// import { useState, useEffect } from "react";
// import StatsSummary from "../components/asset-dashboard/StatsSummary";
// import AssetRow from "../components/asset-dashboard/AssetRow";
// import { ChevronDown, ChevronRight, SlidersHorizontal, X } from "lucide-react";
// import * as AssetAPI from "../api/assetApi";

// // --- Helper Functions for Data Normalization (Unchanged) ---

// // Normalizes assets from the 'assets' array (ONTs and Routers)
// function normalizeAsset(asset) {
//   return {
//     id: asset.asset_id,
//     type: asset.type, // Will be "ONT" or "Router"
//     model: asset.model,
//     serial: asset.serial_number,
//     status: asset.status,
//     // New fields for filtering
//     customerId: asset.assigned_to_customer_id,
//     warehouseId: asset.stored_at_warehouse_id,
//     // Store original data for the detail view
//     originalData: asset,
//   };
// }

// // Normalizes assets from the 'fdhs' array
// function normalizeFdh(fdh) {
//   return {
//     id: fdh.fdh_id,
//     type: "FDH",
//     model: fdh.model,
//     serial: `Pincode: ${fdh.pincode}`,
//     status: "Active",
//     customerId: null,
//     warehouseId: null, // FDHs are in the field
//     originalData: fdh,
//   };
// }

// // Normalizes assets from the 'splitters' array
// function normalizeSplitter(splitter) {
//   return {
//     id: splitter.splitter_id,
//     type: "Splitter",
//     model: splitter.model,
//     serial: `In FDH: ${splitter.fdh_id}`,
//     status: splitter.status,
//     customerId: null,
//     warehouseId: null, // Splitters are in FDHs
//     originalData: splitter,
//   };
// }

// // --- NEW: Unified Filter Box Component ---
// function FilterBox({
//   warehouseList,
//   filterInputs,
//   onInputChange,
//   onApplyFilters,
//   onClearFilters,
// }) {
//   const isCustomerDisabled = filterInputs.warehouseId !== "";
//   const isWarehouseDisabled = filterInputs.customerId !== "";

//   return (
//     <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg mb-4">
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         {/* Warehouse Dropdown */}
//         <div>
//           <label
//             htmlFor="warehouseId"
//             className="block text-sm font-medium text-gray-700 mb-1"
//           >
//             Warehouse
//           </label>
//           <select
//             id="warehouseId"
//             name="warehouseId"
//             value={filterInputs.warehouseId}
//             onChange={onInputChange}
//             disabled={isWarehouseDisabled}
//             className={`w-full text-sm text-gray-700 bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//               isWarehouseDisabled ? "bg-gray-100 cursor-not-allowed" : ""
//             }`}
//           >
//             <option value="">All Warehouses</option>
//             {warehouseList.map((w) => (
//               <option key={w.id} value={w.id}>
//                 {w.address} (ID: {w.id})
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Customer ID Input */}
//         <div>
//           <label
//             htmlFor="customerId"
//             className="block text-sm font-medium text-gray-700 mb-1"
//           >
//             Customer ID
//           </label>
//           <input
//             type="text"
//             id="customerId"
//             name="customerId"
//             value={filterInputs.customerId}
//             onChange={onInputChange}
//             disabled={isCustomerDisabled}
//             placeholder="Enter Customer ID"
//             className={`w-full text-sm text-gray-700 bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//               isCustomerDisabled ? "bg-gray-100 cursor-not-allowed" : ""
//             }`}
//           />
//         </div>

//         {/* Pincode Input */}
//         <div>
//           <label
//             htmlFor="pincode"
//             className="block text-sm font-medium text-gray-700 mb-1"
//           >
//             Pincode
//           </label>
//           <input
//             type="text"
//             id="pincode"
//             name="pincode"
//             value={filterInputs.pincode}
//             onChange={onInputChange}
//             placeholder="Enter Pincode"
//             className="w-full text-sm text-gray-700 bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//           />
//         </div>
//       </div>

//       {/* Action Buttons */}
//       <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t">
//         <button
//           onClick={onClearFilters}
//           className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-colors text-sm font-semibold"
//         >
//           <X size={16} />
//           Clear
//         </button>
//         <button
//           onClick={onApplyFilters}
//           className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow text-sm font-semibold"
//         >
//           <SlidersHorizontal size={16} />
//           Apply Filters
//         </button>
//       </div>
//     </div>
//   );
// }

// // --- Section Header Component (Unchanged) ---
// function SectionHeader({ title, count, isOpen, onToggle }) {
//   return (
//     <button
//       onClick={onToggle}
//       className="flex items-center justify-between w-full p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
//     >
//       <div className="flex items-center gap-2">
//         {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
//         <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
//       </div>
//       <span className="px-2 py-0.5 bg-gray-300 text-gray-700 text-sm font-medium rounded-full">
//         {count}
//       </span>
//     </button>
//   );
// }

// // --- Main Dashboard Component ---

// export default function AssetDashboard() {
//   const [allAssets, setAllAssets] = useState([]); // Holds ALL normalized assets
//   const [displayAssets, setDisplayAssets] = useState([]); // Holds assets to render
//   const [loading, setLoading] = useState(true);
//   const [warehouseList, setWarehouseList] = useState([]);

//   const [editingAsset, setEditingAsset] = useState(null);
//   const [selectedAssetId, setSelectedAssetId] = useState(null);

//   // --- NEW: Staging state for filter inputs before applying ---
//   const [filterInputs, setFilterInputs] = useState({
//     warehouseId: "",
//     customerId: "",
//     pincode: "",
//   });

//   // --- NEW: State for *applied* filters ---
//   const [filters, setFilters] = useState({
//     warehouseId: "",
//     customerId: "",
//     pincode: "",
//   });

//   // State for collapsible sections (Unchanged)
//   const [collapseState, setCollapseState] = useState({
//     ont: true,
//     router: true,
//     fdh: true,
//     splitter: true,
//   });

//   useEffect(() => {
//     loadData();
//   }, []);

//   // --- NEW: useEffect to apply filters ---
//   // This runs when 'filters' state changes (i.e., on Apply or Clear)
//   useEffect(() => {
//     let assets = [...allAssets];

//     // 1. Filter by Warehouse ID
//     if (filters.warehouseId) {
//       assets = assets.filter(
//         (a) => a.warehouseId?.toString() === filters.warehouseId
//       );
//     }

//     // 2. Filter by Customer ID
//     if (filters.customerId) {
//       assets = assets.filter(
//         (a) => a.customerId?.toString() === filters.customerId
//       );
//     }

//     // 3. Filter by Pincode
//     if (filters.pincode) {
//       assets = assets.filter((a) =>
//         a.originalData.pincode?.startsWith(filters.pincode)
//       );
//     }

//     setDisplayAssets(assets);
//   }, [filters, allAssets]); // Re-filter when 'filters' or 'allAssets' changes

//   const loadData = async () => {
//     setLoading(true);
//     try {
//       const data = await AssetAPI.fetchAssets();
//       console.log(data);

//       // Normalize
//       const ontsAndRouters = data.assets.map(normalizeAsset);
//       const fdhs = data.fdhs.map(normalizeFdh);
//       const splitters = data.splitters.map(normalizeSplitter);

//       const combinedAssets = [...ontsAndRouters, ...fdhs, ...splitters];
//       setAllAssets(combinedAssets);
//       setDisplayAssets(combinedAssets); // Set initial display

//       // --- NEW: Extract unique warehouses ---
//       const warehouses = data.assets
//         .map((a) => a.warehouse)
//         .filter((w) => w !== null); // Filter out nulls
//       const uniqueWarehouses = Array.from(
//         new Map(warehouses.map((w) => [w.warehouse_id, w])).values()
//       );
//       setWarehouseList(
//         uniqueWarehouses.map((w) => ({
//           id: w.warehouse_id,
//           address: w.address,
//         }))
//       );
//     } catch (error) {
//       console.error("Failed to load data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- Handlers ---

//   // (C/U/D Handlers are unchanged and still disabled)
//   const handleSaveAsset = async (formData) => {
//     console.warn("Save logic needs to be updated for new data structure.");
//     setEditingAsset(null);
//     setSelectedAssetId(null);
//   };
//   const handleAddNewAsset = () => {
//     console.warn("Add logic needs to be updated.");
//   };
//   const handleEditAsset = (asset) => {
//     console.warn("Edit logic needs to be updated.");
//   };
//   const handleDeleteAsset = async (id) => {
//     console.warn("Delete logic needs to be updated.");
//   };
//   const handleCancelEdit = () => {
//     setEditingAsset(null);
//   };

//   // (onSelect handler is unchanged)
//   const handleSelectAsset = (assetId) => {
//     setEditingAsset(null);
//     if (selectedAssetId === assetId) {
//       setSelectedAssetId(null);
//     } else {
//       setSelectedAssetId(assetId);
//     }
//   };

//   // --- NEW: Filter Handlers ---
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFilterInputs((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleApplyFilters = () => {
//     setFilters(filterInputs); // Apply the staged inputs
//   };

//   const handleClearFilters = () => {
//     const clearedFilters = {
//       warehouseId: "",
//       customerId: "",
//       pincode: "",
//     };
//     setFilterInputs(clearedFilters); // Clear staging inputs
//     setFilters(clearedFilters); // Clear applied filters
//   };

//   // Handler for collapsing sections (Unchanged)
//   const toggleCollapse = (section) => {
//     setCollapseState((prev) => ({
//       ...prev,
//       [section]: !prev[section],
//     }));
//   };

//   // --- NEW: Group assets from 'displayAssets' ---
//   const onts = displayAssets.filter((a) => a.type === "ONT");
//   const routers = displayAssets.filter((a) => a.type === "Router");
//   const fdhs = displayAssets.filter((a) => a.type === "FDH");
//   const splitters = displayAssets.filter((a) => a.type === "Splitter");

//   // --- Loading State (Unchanged) ---
//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <p>Loading Assets...</p>
//       </div>
//     );
//   }

//   // --- JSX Return ---
//   return (
//     <div className="container mx-auto px-4 py-6">
//       <div className="flex flex-col lg:flex-row gap-6">
//         {/* Asset List (Left Side) */}
//         <div className="flex-1">
//           {/* --- MODIFIED: Header --- */}
//           <div className="flex flex-wrap items-center justify-between mb-4 gap-4">
//             <h1 className="text-2xl font-bold text-gray-800">
//               Asset Dashboard
//             </h1>
//           </div>

//           {/* --- NEW: Filter Box --- */}
//           <FilterBox
//             warehouseList={warehouseList}
//             filterInputs={filterInputs}
//             onInputChange={handleInputChange}
//             onApplyFilters={handleApplyFilters}
//             onClearFilters={handleClearFilters}
//           />

//           {/* Asset List --- Collapsible UI (Unchanged) --- */}
//           <div className="space-y-4">
//             {/* --- ONTs --- */}
//             <div className="space-y-2">
//               <SectionHeader
//                 title="ONTs"
//                 count={onts.length}
//                 isOpen={collapseState.ont}
//                 onToggle={() => toggleCollapse("ont")}
//               />
//               {collapseState.ont && (
//                 <div className="space-y-2 pl-4">
//                   {onts.map((asset) => (
//                     <AssetRow
//                       key={asset.id}
//                       asset={asset}
//                       isSelected={selectedAssetId === asset.id}
//                       onSelect={handleSelectAsset}
//                     />
//                   ))}
//                   {onts.length === 0 && !loading && (
//                     <p className="text-gray-500 text-sm px-4 py-2">
//                       No ONTs found for this filter.
//                     </p>
//                   )}
//                 </div>
//               )}
//             </div>

//             {/* --- Routers --- */}
//             <div className="space-y-2">
//               <SectionHeader
//                 title="Routers"
//                 count={routers.length}
//                 isOpen={collapseState.router}
//                 onToggle={() => toggleCollapse("router")}
//               />
//               {collapseState.router && (
//                 <div className="space-y-2 pl-4">
//                   {routers.map((asset) => (
//                     <AssetRow
//                       key={asset.id}
//                       asset={asset}
//                       isSelected={selectedAssetId === asset.id}
//                       onSelect={handleSelectAsset}
//                     />
//                   ))}
//                   {routers.length === 0 && !loading && (
//                     <p className="text-gray-500 text-sm px-4 py-2">
//                       No Routers found for this filter.
//                     </p>
//                   )}
//                 </div>
//               )}
//             </div>

//             {/* --- FDHs --- */}
//             <div className="space-y-2">
//               <SectionHeader
//                 title="FDHs"
//                 count={fdhs.length}
//                 isOpen={collapseState.fdh}
//                 onToggle={() => toggleCollapse("fdh")}
//               />
//               {collapseState.fdh && (
//                 <div className="space-y-2 pl-4">
//                   {fdhs.map((asset) => (
//                     <AssetRow
//                       key={asset.id}
//                       asset={asset}
//                       isSelected={selectedAssetId === asset.id}
//                       onSelect={handleSelectAsset}
//                     />
//                   ))}
//                   {fdhs.length === 0 && !loading && (
//                     <p className="text-gray-500 text-sm px-4 py-2">
//                       No FDHs found for this filter.
//                     </p>
//                   )}
//                 </div>
//               )}
//             </div>

//             {/* --- Splitters --- */}
//             <div className="space-y-2">
//               <SectionHeader
//                 title="Splitters"
//                 count={splitters.length}
//                 isOpen={collapseState.splitter}
//                 onToggle={() => toggleCollapse("splitter")}
//               />
//               {collapseState.splitter && (
//                 <div className="space-y-2 pl-4">
//                   {splitters.map((asset) => (
//                     <AssetRow
//                       key={asset.id}
//                       asset={asset}
//                       isSelected={selectedAssetId === asset.id}
//                       onSelect={handleSelectAsset}
//                     />
//                   ))}
//                   {splitters.length === 0 && !loading && (
//                     <p className="text-gray-500 text-sm px-4 py-2">
//                       No Splitters found for this filter.
//                     </p>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Stats Summary (Right Side) --- MODIFIED --- */}
//         <div className="lg:w-64">
//           {/* Pass 'displayAssets' to show stats for filtered items */}
//           <StatsSummary assets={displayAssets} />
//         </div>
//       </div>
//     </div>
//   );
// }

// import { useState, useEffect } from "react";
// import StatsSummary from "../components/asset-dashboard/StatsSummary";
// import AssetRow from "../components/asset-dashboard/AssetRow";
// import {
//   ChevronDown,
//   ChevronRight,
//   SlidersHorizontal,
//   X,
//   Plus, // --- NEW: Import Plus icon ---
// } from "lucide-react";
// import * as AssetAPI from "../api/assetApi";
// // --- NEW: Import the modal components ---
// import AddAssetModal from "../components/asset-dashboard/AddAssetModal";
// import ConfirmationModal from "../components/asset-dashboard/ConfirmationModal"; // (In case you need it elsewhere)

// // --- Helper Functions for Data Normalization (Unchanged) ---
// // ... (normalizeAsset, normalizeFdh, normalizeSplitter)
// function normalizeAsset(asset) {
//   return {
//     id: asset.asset_id,
//     type: asset.type,
//     model: asset.model,
//     serial: asset.serial_number,
//     status: asset.status,
//     customerId: asset.assigned_to_customer_id,
//     warehouseId: asset.stored_at_warehouse_id,
//     originalData: asset,
//   };
// }
// function normalizeFdh(fdh) {
//   return {
//     id: fdh.fdh_id,
//     type: "FDH",
//     model: fdh.model,
//     serial: `Pincode: ${fdh.pincode}`,
//     status: "Active",
//     customerId: null,
//     warehouseId: null,
//     originalData: fdh,
//   };
// }
// function normalizeSplitter(splitter) {
//   return {
//     id: splitter.splitter_id,
//     type: "Splitter",
//     model: splitter.model,
//     serial: `In FDH: ${splitter.fdh_id}`,
//     status: splitter.status,
//     customerId: null,
//     warehouseId: null,
//     originalData: splitter,
//   };
// }

// // --- FilterBox Component (Unchanged) ---
// // ... (FilterBox component)
// function FilterBox({
//   warehouseList,
//   filterInputs,
//   onInputChange,
//   onApplyFilters,
//   onClearFilters,
// }) {
//   const isCustomerDisabled = filterInputs.warehouseId !== "";
//   const isWarehouseDisabled = filterInputs.customerId !== "";
//   return (
//     <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg mb-4">
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         <div>
//           <label
//             htmlFor="warehouseId"
//             className="block text-sm font-medium text-gray-700 mb-1"
//           >
//             Warehouse
//           </label>
//           <select
//             id="warehouseId"
//             name="warehouseId"
//             value={filterInputs.warehouseId}
//             onChange={onInputChange}
//             disabled={isWarehouseDisabled}
//             className={`w-full text-sm text-gray-700 bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//               isWarehouseDisabled ? "bg-gray-100 cursor-not-allowed" : ""
//             }`}
//           >
//             <option value="">All Warehouses</option>
//             {warehouseList.map((w) => (
//               <option key={w.id} value={w.id}>
//                 {w.address} (ID: {w.id})
//               </option>
//             ))}
//           </select>
//         </div>
//         <div>
//           <label
//             htmlFor="customerId"
//             className="block text-sm font-medium text-gray-700 mb-1"
//           >
//             Customer ID
//           </label>
//           <input
//             type="text"
//             id="customerId"
//             name="customerId"
//             value={filterInputs.customerId}
//             onChange={onInputChange}
//             disabled={isCustomerDisabled}
//             placeholder="Enter Customer ID"
//             className={`w-full text-sm text-gray-700 bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//               isCustomerDisabled ? "bg-gray-100 cursor-not-allowed" : ""
//             }`}
//           />
//         </div>
//         <div>
//           <label
//             htmlFor="pincode"
//             className="block text-sm font-medium text-gray-700 mb-1"
//           >
//             Pincode
//           </label>
//           <input
//             type="text"
//             id="pincode"
//             name="pincode"
//             value={filterInputs.pincode}
//             onChange={onInputChange}
//             placeholder="Enter Pincode"
//             className="w-full text-sm text-gray-700 bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//           />
//         </div>
//       </div>
//       <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t">
//         <button
//           onClick={onClearFilters}
//           className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-colors text-sm font-semibold"
//         >
//           <X size={16} />
//           Clear
//         </button>
//         <button
//           onClick={onApplyFilters}
//           className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow text-sm font-semibold"
//         >
//           <SlidersHorizontal size={16} />
//           Apply Filters
//         </button>
//       </div>
//     </div>
//   );
// }

// // --- Section Header Component (Unchanged) ---
// // ... (SectionHeader component)
// function SectionHeader({ title, count, isOpen, onToggle }) {
//   return (
//     <button
//       onClick={onToggle}
//       className="flex items-center justify-between w-full p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
//     >
//       <div className="flex items-center gap-2">
//         {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
//         <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
//       </div>
//       <span className="px-2 py-0.5 bg-gray-300 text-gray-700 text-sm font-medium rounded-full">
//         {count}
//       </span>
//     </button>
//   );
// }

// // --- Main Dashboard Component ---

// export default function AssetDashboard() {
//   const [allAssets, setAllAssets] = useState([]);
//   const [displayAssets, setDisplayAssets] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [warehouseList, setWarehouseList] = useState([]);
//   // --- NEW: State for available splitters ---
//   const [availableSplitters, setAvailableSplitters] = useState([]);

//   const [selectedAssetId, setSelectedAssetId] = useState(null);
//   const [filterInputs, setFilterInputs] = useState({
//     /* ... */
//   });
//   const [filters, setFilters] = useState({
//     /* ... */
//   });
//   const [collapseState, setCollapseState] = useState({
//     /* ... */
//   });

//   // --- NEW: State for Add Asset Modal ---
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);

//   useEffect(() => {
//     loadData();
//   }, []);

//   // (useEffect for filters is unchanged)
//   useEffect(() => {
//     let assets = [...allAssets];
//     if (filters.warehouseId) {
//       assets = assets.filter(
//         (a) => a.warehouseId?.toString() === filters.warehouseId
//       );
//     }
//     if (filters.customerId) {
//       assets = assets.filter(
//         (a) => a.customerId?.toString() === filters.customerId
//       );
//     }
//     if (filters.pincode) {
//       assets = assets.filter((a) =>
//         a.originalData.pincode?.startsWith(filters.pincode)
//       );
//     }
//     setDisplayAssets(assets);
//   }, [filters, allAssets]);

//   // --- MODIFIED: loadData ---
//   const loadData = async () => {
//     setLoading(true);
//     try {
//       const data = await AssetAPI.fetchAssets();
//       console.log(data);

//       const ontsAndRouters = data.assets.map(normalizeAsset);
//       const fdhs = data.fdhs.map(normalizeFdh);
//       const splitters = data.splitters.map(normalizeSplitter);

//       const combinedAssets = [...ontsAndRouters, ...fdhs, ...splitters];
//       setAllAssets(combinedAssets);
//       setDisplayAssets(combinedAssets);

//       // Extract unique warehouses (Unchanged)
//       const warehouses = data.assets
//         .map((a) => a.warehouse)
//         .filter((w) => w !== null);
//       const uniqueWarehouses = Array.from(
//         new Map(warehouses.map((w) => [w.warehouse_id, w])).values()
//       );
//       setWarehouseList(
//         uniqueWarehouses.map((w) => ({
//           id: w.warehouse_id,
//           address: w.address,
//         }))
//       );

//       // --- NEW: Extract available splitters ---
//       // (We assume 'available' splitters are not yet assigned to an FDH)
//       // (Your sample data has fdh_id on all splitters, so I'll filter by status)
//       const availSplitters = data.splitters.filter(
//         (s) => s.status?.toLowerCase() === "available"
//       );
//       setAvailableSplitters(availSplitters);
//     } catch (error) {
//       console.error("Failed to load data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- Handlers ---

//   // (C/U/D Handlers are unchanged)
//   const handleSelectAsset = (assetId) => {
//     if (selectedAssetId === assetId) {
//       setSelectedAssetId(null);
//     } else {
//       setSelectedAssetId(assetId);
//     }
//   };

//   // (Filter Handlers are unchanged)
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFilterInputs((prev) => ({ ...prev, [name]: value }));
//   };
//   const handleApplyFilters = () => {
//     setFilters(filterInputs);
//   };
//   const handleClearFilters = () => {
//     const clearedFilters = { warehouseId: "", customerId: "", pincode: "" };
//     setFilterInputs(clearedFilters);
//     setFilters(clearedFilters);
//   };

//   // (toggleCollapse is unchanged)
//   const toggleCollapse = (section) => {
//     setCollapseState((prev) => ({ ...prev, [section]: !prev[section] }));
//   };

//   // (Asset group creation is unchanged)
//   const onts = displayAssets.filter((a) => a.type === "ONT");
//   const routers = displayAssets.filter((a) => a.type === "Router");
//   const fdhs = displayAssets.filter((a) => a.type === "FDH");
//   const splitters = displayAssets.filter((a) => a.type === "Splitter");

//   // --- Loading State (Unchanged) ---
//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <p>Loading Assets...</p>
//       </div>
//     );
//   }

//   // --- JSX Return ---
//   return (
//     <>
//       {" "}
//       {/* --- NEW: Added Fragment Wrapper --- */}
//       <div className="container mx-auto px-4 py-6">
//         <div className="flex flex-col lg:flex-row gap-6">
//           {/* Asset List (Left Side) */}
//           <div className="flex-1">
//             {/* --- MODIFIED: Header --- */}
//             <div className="flex flex-wrap items-center justify-between mb-4 gap-4">
//               <div className="flex items-center gap-3">
//                 <h1 className="text-2xl font-bold text-gray-800">
//                   Asset Dashboard
//                 </h1>
//                 {/* --- NEW: Add Asset Button --- */}
//                 <button
//                   onClick={() => setIsAddModalOpen(true)}
//                   className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors shadow text-sm font-semibold"
//                 >
//                   <Plus size={18} />
//                   Add Asset
//                 </button>
//               </div>
//             </div>

//             {/* --- Filter Box (Unchanged) --- */}
//             <FilterBox
//               warehouseList={warehouseList}
//               filterInputs={filterInputs}
//               onInputChange={handleInputChange}
//               onApplyFilters={handleApplyFilters}
//               onClearFilters={handleClearFilters}
//             />

//             {/* --- Asset List (Collapsible UI) (Unchanged) --- */}
//             <div className="space-y-4">
//               {/* --- ONTs --- */}
//               <div className="space-y-2">
//                 <SectionHeader
//                   title="ONTs"
//                   count={onts.length}
//                   isOpen={collapseState.ont}
//                   onToggle={() => toggleCollapse("ont")}
//                 />
//                 {collapseState.ont && (
//                   <div className="space-y-2 pl-4">
//                     {onts.map((asset) => (
//                       <AssetRow
//                         key={asset.id}
//                         asset={asset}
//                         isSelected={selectedAssetId === asset.id}
//                         onSelect={handleSelectAsset}
//                       />
//                     ))}
//                     {onts.length === 0 && !loading && (
//                       <p className="text-gray-500 text-sm px-4 py-2">
//                         No ONTs found for this filter.
//                       </p>
//                     )}
//                   </div>
//                 )}
//               </div>

//               {/* --- Routers --- */}
//               <div className="space-y-2">
//                 <SectionHeader
//                   title="Routers"
//                   count={routers.length}
//                   isOpen={collapseState.router}
//                   onToggle={() => toggleCollapse("router")}
//                 />
//                 {collapseState.router && (
//                   <div className="space-y-2 pl-4">
//                     {routers.map((asset) => (
//                       <AssetRow
//                         key={asset.id}
//                         asset={asset}
//                         isSelected={selectedAssetId === asset.id}
//                         onSelect={handleSelectAsset}
//                       />
//                     ))}
//                     {routers.length === 0 && !loading && (
//                       <p className="text-gray-500 text-sm px-4 py-2">
//                         No Routers found for this filter.
//                       </p>
//                     )}
//                   </div>
//                 )}
//               </div>

//               {/* --- FDHs --- */}
//               <div className="space-y-2">
//                 <SectionHeader
//                   title="FDHs"
//                   count={fdhs.length}
//                   isOpen={collapseState.fdh}
//                   onToggle={() => toggleCollapse("fdh")}
//                 />
//                 {collapseState.fdh && (
//                   <div className="space-y-2 pl-4">
//                     {fdhs.map((asset) => (
//                       <AssetRow
//                         key={asset.id}
//                         asset={asset}
//                         isSelected={selectedAssetId === asset.id}
//                         onSelect={handleSelectAsset}
//                       />
//                     ))}
//                     {fdhs.length === 0 && !loading && (
//                       <p className="text-gray-500 text-sm px-4 py-2">
//                         No FDHs found for this filter.
//                       </p>
//                     )}
//                   </div>
//                 )}
//               </div>

//               {/* --- Splitters --- */}
//               <div className="space-y-2">
//                 <SectionHeader
//                   title="Splitters"
//                   count={splitters.length}
//                   isOpen={collapseState.splitter}
//                   onToggle={() => toggleCollapse("splitter")}
//                 />
//                 {collapseState.splitter && (
//                   <div className="space-y-2 pl-4">
//                     {splitters.map((asset) => (
//                       <AssetRow
//                         key={asset.id}
//                         asset={asset}
//                         isSelected={selectedAssetId === asset.id}
//                         onSelect={handleSelectAsset}
//                       />
//                     ))}
//                     {splitters.length === 0 && !loading && (
//                       <p className="text-gray-500 text-sm px-4 py-2">
//                         No Splitters found for this filter.
//                       </p>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Stats Summary (Right Side) (Unchanged) */}
//           <div className="lg:w-64">
//             <StatsSummary assets={displayAssets} />
//           </div>
//         </div>
//       </div>
//       {/* --- NEW: Render the AddAssetModal --- */}
//       <AddAssetModal
//         isOpen={isAddModalOpen}
//         onClose={() => setIsAddModalOpen(false)}
//         warehouseList={warehouseList}
//         availableSplitters={availableSplitters}
//       />
//     </>
//   );
// }

import { useState, useEffect } from "react";
import StatsSummary from "../components/asset-dashboard/StatsSummary";
import AssetRow from "../components/asset-dashboard/AssetRow";
import {
  ChevronDown,
  ChevronRight,
  SlidersHorizontal,
  X,
  Plus,
  GitBranch, // --- NEW: Import GitBranch
} from "lucide-react";
import * as AssetAPI from "../api/assetApi";
import AddAssetModal from "../components/asset-dashboard/AddAssetModal";
import ConfirmationModal from "../components/asset-dashboard/ConfirmationModal";
// --- NEW: Import the new modal ---
import CustomerBranchModal from "../components/asset-dashboard/CustomerBranchModal";

// ... (normalizeAsset, normalizeFdh, normalizeSplitter functions are unchanged) ...
function normalizeAsset(asset) {
  return {
    id: asset.asset_id,
    type: asset.type,
    model: asset.model,
    serial: asset.serial_number,
    status: asset.status,
    customerId: asset.assigned_to_customer_id,
    warehouseId: asset.stored_at_warehouse_id,
    originalData: asset,
  };
}
function normalizeFdh(fdh) {
  return {
    id: fdh.fdh_id,
    type: "FDH",
    model: fdh.model,
    serial: `Pincode: ${fdh.pincode}`,
    status: "Active",
    customerId: null,
    warehouseId: null,
    originalData: fdh,
  };
}
function normalizeSplitter(splitter) {
  return {
    id: splitter.splitter_id,
    type: "Splitter",
    model: splitter.model,
    serial: `In FDH: ${splitter.fdh_id}`,
    status: splitter.status,
    customerId: null,
    warehouseId: null,
    originalData: splitter,
  };
}

// --- MODIFIED: FilterBox Component ---
function FilterBox({
  warehouseList,
  filterInputs,
  onInputChange,
  onApplyFilters,
  onClearFilters,
}) {
  // --- FIX: Removed mutual-exclusivity logic ---
  return (
    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg mb-4">
      {/* --- FIX: Changed grid to md:grid-cols-2 --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            value={filterInputs.warehouseId}
            onChange={onInputChange}
            className="w-full text-sm text-gray-700 bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Warehouses</option>
            {warehouseList.map((w) => (
              <option key={w.id} value={w.id}>
                {w.address} (ID: {w.id})
              </option>
            ))}
          </select>
        </div>

        {/* --- FIX: Removed Customer ID Input --- */}

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
            value={filterInputs.pincode}
            onChange={onInputChange}
            placeholder="Enter Pincode"
            className="w-full text-sm text-gray-700 bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
      <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t">
        <button
          onClick={onClearFilters}
          className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-colors text-sm font-semibold"
        >
          <X size={16} />
          Clear
        </button>
        <button
          onClick={onApplyFilters}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow text-sm font-semibold"
        >
          <SlidersHorizontal size={16} />
          Apply Filters
        </button>
      </div>
    </div>
  );
}

// ... (SectionHeader component is unchanged) ...
function SectionHeader({ title, count, isOpen, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center justify-between w-full p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
    >
      <div className="flex items-center gap-2">
        {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      </div>
      <span className="px-2 py-0.5 bg-gray-300 text-gray-700 text-sm font-medium rounded-full">
        {count}
      </span>
    </button>
  );
}

// --- Main Dashboard Component ---

export default function AssetDashboard() {
  const [allAssets, setAllAssets] = useState([]);
  const [displayAssets, setDisplayAssets] = useState([]);
  // --- NEW: State for raw data ---
  const [originalData, setOriginalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [warehouseList, setWarehouseList] = useState([]);

  const [selectedAssetId, setSelectedAssetId] = useState(null);
  // --- FIX: Removed customerId from filter states ---
  const [filterInputs, setFilterInputs] = useState({
    warehouseId: "",
    pincode: "",
  });
  const [filters, setFilters] = useState({
    warehouseId: "",
    pincode: "",
  });
  const [collapseState, setCollapseState] = useState({
    ont: true,
    router: true,
    fdh: true,
    splitter: true,
  });

  // --- NEW: State for Modals ---
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCustomerBranchModalOpen, setIsCustomerBranchModalOpen] =
    useState(false);

  useEffect(() => {
    loadData();
  }, []);

  // --- FIX: Updated filter logic ---
  useEffect(() => {
    let assets = [...allAssets];
    if (filters.warehouseId) {
      assets = assets.filter(
        (a) => a.warehouseId?.toString() === filters.warehouseId
      );
    }
    // --- FIX: Removed customerId filter block ---
    if (filters.pincode) {
      assets = assets.filter((a) =>
        a.originalData.pincode?.startsWith(filters.pincode)
      );
    }
    setDisplayAssets(assets);
  }, [filters, allAssets]);

  // --- MODIFIED: loadData ---
  const loadData = async () => {
    setLoading(true);
    try {
      const data = await AssetAPI.fetchAssets();
      console.log(data);
      // --- NEW: Store raw data ---
      setOriginalData(data);

      const ontsAndRouters = data.assets.map(normalizeAsset);
      const fdhs = data.fdhs.map(normalizeFdh);
      const splitters = data.splitters.map(normalizeSplitter);

      const combinedAssets = [...ontsAndRouters, ...fdhs, ...splitters];
      setAllAssets(combinedAssets);
      setDisplayAssets(combinedAssets);

      // Extract unique warehouses (Unchanged)
      const warehouses = data.assets
        .map((a) => a.warehouse)
        .filter((w) => w !== null);
      const uniqueWarehouses = Array.from(
        new Map(warehouses.map((w) => [w.warehouse_id, w])).values()
      );
      setWarehouseList(
        uniqueWarehouses.map((w) => ({
          id: w.warehouse_id,
          address: w.address,
        }))
      );
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- Handlers ---

  const handleSelectAsset = (assetId) => {
    // ... (unchanged)
    if (selectedAssetId === assetId) {
      setSelectedAssetId(null);
    } else {
      setSelectedAssetId(assetId);
    }
  };

  // --- FIX: Updated Filter Handlers ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilterInputs((prev) => ({ ...prev, [name]: value }));
  };
  const handleApplyFilters = () => {
    setFilters(filterInputs);
  };
  const handleClearFilters = () => {
    const clearedFilters = { warehouseId: "", pincode: "" };
    setFilterInputs(clearedFilters);
    setFilters(clearedFilters);
  };

  const toggleCollapse = (section) => {
    // ... (unchanged)
    setCollapseState((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // (Asset group creation is unchanged)
  const onts = displayAssets.filter((a) => a.type === "ONT");
  // ... (routers, fdhs, splitters)
  const routers = displayAssets.filter((a) => a.type === "Router");
  const fdhs = displayAssets.filter((a) => a.type === "FDH");
  const splitters = displayAssets.filter((a) => a.type === "Splitter");

  // --- Loading State (Unchanged) ---
  if (loading) {
    // ... (loading spinner)
  }

  // --- JSX Return ---
  return (
    <>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Asset List (Left Side) */}
          <div className="flex-1">
            {/* --- MODIFIED: Header --- */}
            <div className="flex flex-col mb-4 gap-4">
              <h1 className="text-2xl font-bold text-gray-800">
                Asset Dashboard
              </h1>
              {/* --- NEW: Button Bar --- */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors shadow text-sm font-semibold"
                >
                  <Plus size={18} />
                  Add Asset
                </button>
                <button
                  onClick={() => setIsCustomerBranchModalOpen(true)}
                  className="flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 px-3 py-2 rounded-lg transition-colors shadow-sm text-sm font-semibold"
                >
                  <GitBranch size={16} />
                  View Customer Branch
                </button>
              </div>
            </div>

            {/* --- Filter Box (Modified via component) --- */}
            <FilterBox
              warehouseList={warehouseList}
              filterInputs={filterInputs}
              onInputChange={handleInputChange}
              onApplyFilters={handleApplyFilters}
              onClearFilters={handleClearFilters}
            />

            {/* --- Asset List (Collapsible UI) (Unchanged) --- */}
            <div className="space-y-4">
              {/* --- ONTs --- */}
              <div className="space-y-2">
                <SectionHeader
                  title="ONTs"
                  count={onts.length}
                  isOpen={collapseState.ont}
                  onToggle={() => toggleCollapse("ont")}
                />
                {collapseState.ont && (
                  <div className="space-y-2 pl-4">
                    {onts.map((asset) => (
                      <AssetRow
                        key={asset.id}
                        asset={asset}
                        isSelected={selectedAssetId === asset.id}
                        onSelect={handleSelectAsset}
                      />
                    ))}
                    {onts.length === 0 && !loading && (
                      <p className="text-gray-500 text-sm px-4 py-2">
                        No ONTs found for this filter.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* --- Routers --- */}
              <div className="space-y-2">
                <SectionHeader
                  title="Routers"
                  count={routers.length}
                  isOpen={collapseState.router}
                  onToggle={() => toggleCollapse("router")}
                />
                {collapseState.router && (
                  <div className="space-y-2 pl-4">
                    {routers.map((asset) => (
                      <AssetRow
                        key={asset.id}
                        asset={asset}
                        isSelected={selectedAssetId === asset.id}
                        onSelect={handleSelectAsset}
                      />
                    ))}
                    {routers.length === 0 && !loading && (
                      <p className="text-gray-500 text-sm px-4 py-2">
                        No Routers found for this filter.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* --- FDHs --- */}
              <div className="space-y-2">
                <SectionHeader
                  title="FDHs"
                  count={fdhs.length}
                  isOpen={collapseState.fdh}
                  onToggle={() => toggleCollapse("fdh")}
                />
                {collapseState.fdh && (
                  <div className="space-y-2 pl-4">
                    {fdhs.map((asset) => (
                      <AssetRow
                        key={asset.id}
                        asset={asset}
                        isSelected={selectedAssetId === asset.id}
                        onSelect={handleSelectAsset}
                      />
                    ))}
                    {fdhs.length === 0 && !loading && (
                      <p className="text-gray-500 text-sm px-4 py-2">
                        No FDHs found for this filter.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* --- Splitters --- */}
              <div className="space-y-2">
                <SectionHeader
                  title="Splitters"
                  count={splitters.length}
                  isOpen={collapseState.splitter}
                  onToggle={() => toggleCollapse("splitter")}
                />
                {collapseState.splitter && (
                  <div className="space-y-2 pl-4">
                    {splitters.map((asset) => (
                      <AssetRow
                        key={asset.id}
                        asset={asset}
                        isSelected={selectedAssetId === asset.id}
                        onSelect={handleSelectAsset}
                      />
                    ))}
                    {splitters.length === 0 && !loading && (
                      <p className="text-gray-500 text-sm px-4 py-2">
                        No Splitters found for this filter.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stats Summary (Right Side) (Unchanged) */}
          <div className="lg:w-64">
            <StatsSummary assets={displayAssets} />
          </div>
        </div>
      </div>

      {/* --- Render Modals --- */}
      <AddAssetModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        warehouseList={warehouseList}
      />

      {/* --- NEW: Render CustomerBranchModal --- */}
      <CustomerBranchModal
        isOpen={isCustomerBranchModalOpen}
        onClose={() => setIsCustomerBranchModalOpen(false)}
        allData={originalData}
      />
    </>
  );
}
