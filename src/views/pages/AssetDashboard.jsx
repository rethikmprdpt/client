/* eslint-disable no-unused-vars */
// import { useState, useEffect } from "react";
// import StatsSummary from "../../components/asset-dashboard/StatsSummary";
// import AssetRow from "../../components/asset-dashboard/AssetRow";
// import {
//   ChevronDown,
//   ChevronRight,
//   SlidersHorizontal,
//   X,
//   Plus,
//   GitBranch,
// } from "lucide-react";
// import * as AssetAPI from "../../api/assetApi";
// import AddAssetModal from "../../components/asset-dashboard/AddAssetModal";
// import ConfirmationModal from "../../components/asset-dashboard/ConfirmationModal";
// import CustomerBranchModal from "../../components/asset-dashboard/CustomerBranchModal";
// // --- NEW: Import the Edit Modal ---
// import EditAssetModal from "../../components/asset-dashboard/EditAssetModal";

// // Helper function to normalize asset data
// function normalizeAsset(asset) {
//   return {
//     id: asset.asset_id,
//     type: asset.type,
//     model: asset.model,
//     serial: asset.serial_number,
//     status: asset.status,
//     customerId: asset.assigned_to_customer_id,
//     originalData: asset,
//   };
// }

// // Helper function to normalize FDH data
// function normalizeFdh(fdh) {
//   return {
//     id: fdh.fdh_id,
//     type: "FDH",
//     model: fdh.model,
//     serial: `Pincode: ${fdh.pincode}`,
//     status: "Active", // FDHs are generally 'Active'
//     customerId: null,
//     originalData: fdh,
//   };
// }

// // Helper function to normalize Splitter data
// function normalizeSplitter(splitter) {
//   return {
//     id: splitter.splitter_id,
//     type: "Splitter",
//     model: splitter.model,
//     serial: splitter.fdh_id ? `In FDH: ${splitter.fdh_id}` : "Unassigned",
//     status: splitter.status,
//     customerId: null,
//     originalData: splitter,
//   };
// }

// // FilterBox component
// function FilterBox({
//   filterInputs,
//   onInputChange,
//   onApplyFilters,
//   onClearFilters,
// }) {
//   return (
//     <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg mb-4">
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

// // SectionHeader component
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

// export default function AssetDashboard() {
//   const [allAssets, setAllAssets] = useState([]);
//   const [displayAssets, setDisplayAssets] = useState([]);
//   const [originalData, setOriginalData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [availableSplitters, setAvailableSplitters] = useState([]);

//   const [selectedAssetId, setSelectedAssetId] = useState(null);
//   const [filterInputs, setFilterInputs] = useState({
//     pincode: "",
//   });
//   const [filters, setFilters] = useState({
//     pincode: "",
//   });
//   const [collapseState, setCollapseState] = useState({
//     ont: true,
//     router: true,
//     fdh: true,
//     splitter: true,
//   });

//   // --- State for Modals ---
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//   const [isCustomerBranchModalOpen, setIsCustomerBranchModalOpen] =
//     useState(false);
//   // --- State for Edit/Delete ---
//   const [assetToEdit, setAssetToEdit] = useState(null);
//   const [assetToDelete, setAssetToDelete] = useState(null);

//   useEffect(() => {
//     loadData();
//   }, []);

//   // Filter logic
//   useEffect(() => {
//     let assets = [...allAssets];
//     if (filters.pincode) {
//       assets = assets.filter((a) =>
//         a.originalData.pincode?.startsWith(filters.pincode)
//       );
//     }
//     setDisplayAssets(assets);
//   }, [filters, allAssets]);

//   // Main data load
//   const loadData = async () => {
//     setLoading(true);
//     try {
//       const data = await AssetAPI.fetchAssets();
//       console.log(data);
//       setOriginalData(data);

//       // Normalize all asset types
//       const ontsAndRouters = data.assets.map(normalizeAsset);
//       const fdhs = data.fdhs.map(normalizeFdh);
//       const splitters = data.splitters.map(normalizeSplitter);

//       const combinedAssets = [...ontsAndRouters, ...fdhs, ...splitters];
//       setAllAssets(combinedAssets);
//       setDisplayAssets(combinedAssets);

//       // Extract splitters that are not in an FDH
//       const unassignedSplitters = data.splitters.filter(
//         (s) => s.fdh_id === null
//       );
//       setAvailableSplitters(unassignedSplitters);
//     } catch (error) {
//       console.error("Failed to load data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- Handlers ---

//   const handleSelectAsset = (assetId) => {
//     if (selectedAssetId === assetId) {
//       setSelectedAssetId(null);
//     } else {
//       setSelectedAssetId(assetId);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFilterInputs((prev) => ({ ...prev, [name]: value }));
//   };
//   const handleApplyFilters = () => {
//     setFilters(filterInputs);
//   };
//   const handleClearFilters = () => {
//     const clearedFilters = { pincode: "" };
//     setFilterInputs(clearedFilters);
//     setFilters(clearedFilters);
//   };

//   const toggleCollapse = (section) => {
//     setCollapseState((prev) => ({ ...prev, [section]: !prev[section] }));
//   };

//   // --- Handlers for Edit/Delete ---
//   const handleEditRequest = (asset) => {
//     setAssetToEdit(asset);
//   };

//   const handleCloseEditModal = () => {
//     setAssetToEdit(null);
//   };

//   const handleSaveEdit = async (formData) => {
//     if (!assetToEdit) return;

//     // TODO: You will need to implement this API call
//     // await AssetAPI.updateAsset(assetToEdit.type, assetToEdit.id, formData);
//     console.log("Saving update:", assetToEdit.type, assetToEdit.id, formData);

//     setAssetToEdit(null);
//     await loadData(); // Refresh all data
//   };

//   const handleDeleteRequest = (asset) => {
//     setAssetToDelete(asset);
//   };

//   const handleConfirmDelete = async () => {
//     if (!assetToDelete) return;

//     // TODO: You will need to implement this API call
//     // await AssetAPI.deleteAsset(assetToDelete.type, assetToDelete.id);
//     console.log("Deleting:", assetToDelete.type, assetToDelete.id);

//     setAssetToDelete(null);
//     await loadData(); // Refresh all data
//   };

//   // Memoized asset groups
//   const onts = displayAssets.filter((a) => a.type === "ONT");
//   const routers = displayAssets.filter((a) => a.type === "Router");
//   const fdhs = displayAssets.filter((a) => a.type === "FDH");
//   const splitters = displayAssets.filter((a) => a.type === "Splitter");

//   // --- Loading State ---
//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <p>Loading...</p>
//       </div>
//     );
//   }

//   // --- JSX Return ---
//   return (
//     <>
//       <div className="container mx-auto px-4 py-6">
//         <div className="flex flex-col lg:flex-row gap-6">
//           {/* Asset List (Left Side) */}
//           <div className="flex-1">
//             {/* Header */}
//             <div className="flex flex-col mb-4 gap-4">
//               <h1 className="text-2xl font-bold text-gray-800">
//                 Asset Dashboard
//               </h1>
//               <div className="flex flex-wrap items-center justify-between gap-4">
//                 <button
//                   onClick={() => setIsAddModalOpen(true)}
//                   className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors shadow text-sm font-semibold"
//                 >
//                   <Plus size={18} />
//                   Add Asset
//                 </button>
//                 <button
//                   onClick={() => setIsCustomerBranchModalOpen(true)}
//                   className="flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 px-3 py-2 rounded-lg transition-colors shadow-sm text-sm font-semibold"
//                 >
//                   <GitBranch size={16} />
//                   View Customer Branch
//                 </button>
//               </div>
//             </div>

//             {/* Filter Box */}
//             <FilterBox
//               filterInputs={filterInputs}
//               onInputChange={handleInputChange}
//               onApplyFilters={handleApplyFilters}
//               onClearFilters={handleClearFilters}
//             />

//             {/* --- Asset List (Collapsible UI) --- */}
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
//                         onEdit={handleEditRequest}
//                         onDelete={handleDeleteRequest}
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
//                         onEdit={handleEditRequest}
//                         onDelete={handleDeleteRequest}
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
//                         onEdit={handleEditRequest}
//                         onDelete={handleDeleteRequest}
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
//                         onEdit={handleEditRequest}
//                         onDelete={handleDeleteRequest}
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

//           {/* Stats Summary (Right Side) */}
//           <div className="lg:w-64">
//             <StatsSummary assets={displayAssets} />
//           </div>
//         </div>
//       </div>

//       {/* --- Render Modals --- */}
//       <AddAssetModal
//         isOpen={isAddModalOpen}
//         onClose={() => setIsAddModalOpen(false)}
//         availableSplitters={availableSplitters}
//       />

//       <CustomerBranchModal
//         isOpen={isCustomerBranchModalOpen}
//         onClose={() => setIsCustomerBranchModalOpen(false)}
//         allData={originalData}
//       />

//       <EditAssetModal
//         isOpen={!!assetToEdit}
//         onClose={handleCloseEditModal}
//         onSave={handleSaveEdit}
//         asset={assetToEdit}
//         availableSplitters={availableSplitters}
//       />

//       <ConfirmationModal
//         isOpen={!!assetToDelete}
//         onClose={() => setAssetToDelete(null)}
//         onConfirm={handleConfirmDelete}
//         title="Delete Asset?"
//       >
//         <p>
//           Are you sure you want to delete this asset?
//           <br />
//           <strong>
//             {assetToDelete?.model} (ID: {assetToDelete?.id})
//           </strong>
//         </p>
//         <p className="mt-2 text-sm text-red-600">
//           This action cannot be undone.
//         </p>
//       </ConfirmationModal>
//     </>
//   );
// }

import { useState, useEffect } from "react";
import StatsSummary from "../../components/asset-dashboard/StatsSummary";
import AssetRow from "../../components/asset-dashboard/AssetRow";
import {
  ChevronDown,
  ChevronRight,
  SlidersHorizontal,
  X,
  Plus,
  GitBranch,
  Spline, // <-- IMPORT NEW ICON
} from "lucide-react";
import * as AssetAPI from "../../api/assetApi";
import AddAssetModal from "../../components/asset-dashboard/AddAssetModal";
import ConfirmationModal from "../../components/asset-dashboard/ConfirmationModal";
import AssetTreeModal from "../../components/asset-dashboard/AssetTreeModal";
import EditAssetModal from "../../components/asset-dashboard/EditAssetModal";
import SwapAssetModal from "../../components/asset-dashboard/SwapAssetModal";

// ... (Helper functions: normalizeAsset, normalizeFdh, normalizeSplitter are unchanged) ...
// ... (FilterBox component is unchanged) ...
// ... (SectionHeader component is unchanged) ...
function normalizeAsset(asset) {
  return {
    id: asset.asset_id,
    type: asset.type,
    model: asset.model,
    serial: asset.serial_number,
    status: asset.status,
    customerId: asset.assigned_to_customer_id,
    originalData: asset,
  };
}
function normalizeFdh(fdh) {
  return {
    id: fdh.fdh_id,
    type: "FDH",
    model: fdh.model,
    serial: `Pincode: ${fdh.pincode}`,
    status: "Active", // FDHs are generally 'Active'
    customerId: null,
    originalData: fdh,
  };
}
function normalizeSplitter(splitter) {
  return {
    id: splitter.splitter_id,
    type: "Splitter",
    model: splitter.model,
    serial: splitter.fdh_id ? `In FDH: ${splitter.fdh_id}` : "Unassigned",
    status: splitter.status,
    customerId: null,
    originalData: splitter,
  };
}
function FilterBox({
  filterInputs,
  onInputChange,
  onApplyFilters,
  onClearFilters,
}) {
  return (
    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg mb-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

export default function AssetDashboard() {
  const [allAssets, setAllAssets] = useState([]);
  const [displayAssets, setDisplayAssets] = useState([]);
  const [assetToSwap, setAssetToSwap] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [availableSplitters, setAvailableSplitters] = useState([]);

  const [selectedAssetId, setSelectedAssetId] = useState(null);
  const [filterInputs, setFilterInputs] = useState({
    pincode: "",
  });
  const [filters, setFilters] = useState({
    pincode: "",
  });
  const [collapseState, setCollapseState] = useState({
    ont: true,
    router: true,
    fdh: true,
    splitter: true,
  });

  // --- State for Modals ---
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // --- 3. REMOVE OLD MODAL STATE ---
  // const [isCustomerBranchModalOpen, setIsCustomerBranchModalOpen] =
  //   useState(false);

  // --- 4. ADD NEW MODAL STATE ---
  const [isTreeModalOpen, setIsTreeModalOpen] = useState(false);
  const [treeModalType, setTreeModalType] = useState("customer"); // 'customer' or 'fdh'

  // --- State for Edit/Delete ---
  const [assetToEdit, setAssetToEdit] = useState(null);
  const [assetToDelete, setAssetToDelete] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  // Filter logic
  useEffect(() => {
    let assets = [...allAssets];
    if (filters.pincode) {
      assets = assets.filter((a) =>
        a.originalData.pincode?.startsWith(filters.pincode)
      );
    }
    setDisplayAssets(assets);
  }, [filters, allAssets]);

  // Main data load
  const loadData = async () => {
    setLoading(true);
    try {
      const data = await AssetAPI.fetchAssets();
      console.log(data);
      setOriginalData(data);

      // Normalize all asset types
      const ontsAndRouters = data.assets.map(normalizeAsset);
      const fdhs = data.fdhs.map(normalizeFdh);
      const splitters = data.splitters.map(normalizeSplitter);

      const combinedAssets = [...ontsAndRouters, ...fdhs, ...splitters];
      setAllAssets(combinedAssets);
      setDisplayAssets(combinedAssets);

      // Extract splitters that are not in an FDH
      const unassignedSplitters = data.splitters.filter(
        (s) => s.fdh_id === null
      );
      setAvailableSplitters(unassignedSplitters);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- Handlers ---

  const handleAddSuccess = () => {
    setIsAddModalOpen(false); // Close the modal
    loadData(); // Refresh the list to show the new asset
  };

  const handleSwapRequest = (asset) => {
    setAssetToSwap(asset);
  };
  const handleSwapSuccess = () => {
    setAssetToSwap(null);
    loadData(); // Refresh list
  };

  // --- 5. NEW HANDLERS FOR TREE MODAL ---
  const handleOpenCustomerTree = () => {
    setTreeModalType("customer");
    setIsTreeModalOpen(true);
  };

  const handleOpenFdhTree = () => {
    setTreeModalType("fdh");
    setIsTreeModalOpen(true);
  };

  const handleCloseTreeModal = () => {
    setIsTreeModalOpen(false);
  };

  const handleSelectAsset = (assetId) => {
    if (selectedAssetId === assetId) {
      setSelectedAssetId(null);
    } else {
      setSelectedAssetId(assetId);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilterInputs((prev) => ({ ...prev, [name]: value }));
  };
  const handleApplyFilters = () => {
    setFilters(filterInputs);
  };
  const handleClearFilters = () => {
    const clearedFilters = { pincode: "" };
    setFilterInputs(clearedFilters);
    setFilters(clearedFilters);
  };

  const toggleCollapse = (section) => {
    setCollapseState((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // --- Handlers for Edit/Delete ---
  // ... (these handlers are unchanged) ...
  const handleEditRequest = (asset) => {
    setAssetToEdit(asset);
  };
  const handleCloseEditModal = () => {
    setAssetToEdit(null);
  };
  const handleSaveEdit = async (formData) => {
    if (!assetToEdit) return;

    // Restriction: Our current backend /assets endpoint creates ONTs/Routers.
    // FDHs/Splitters are different tables, so we block them here for safety.
    if (assetToEdit.type === "FDH" || assetToEdit.type === "Splitter") {
      alert("Editing FDH or Splitter details is not yet supported.");
      return;
    }

    try {
      // Call the API
      await AssetAPI.updateAsset(assetToEdit.id, formData);

      // Success! Close modal and refresh list
      setAssetToEdit(null);
      loadData();
    } catch (error) {
      console.error("Update failed:", error);
      const errorMsg =
        error.response?.data?.detail || "Failed to update asset.";
      alert(errorMsg); // Simple alert for error, or set a state error if you prefer
    }
  };
  const handleDeleteRequest = (asset) => {
    setAssetToDelete(asset);
  };
  const handleConfirmDelete = async () => {
    if (!assetToDelete) return;

    // Restriction: Block FDH/Splitter deletion for now
    if (assetToDelete.type === "FDH" || assetToDelete.type === "Splitter") {
      alert("Deleting FDH or Splitter is not yet supported.");
      return;
    }

    try {
      // Call the API
      await AssetAPI.deleteAsset(assetToDelete.id);

      // Success! Close modal and refresh list
      setAssetToDelete(null);
      loadData();
    } catch (error) {
      console.error("Delete failed:", error);
      const errorMsg =
        error.response?.data?.detail || "Failed to delete asset.";
      alert(errorMsg);
    }
  };

  // Memoized asset groups
  const onts = displayAssets.filter((a) => a.type === "ONT");
  const routers = displayAssets.filter((a) => a.type === "Router");
  const fdhs = displayAssets.filter((a) => a.type === "FDH");
  const splitters = displayAssets.filter((a) => a.type === "Splitter");

  // --- Loading State ---
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  // --- JSX Return ---
  return (
    <>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Asset List (Left Side) */}
          <div className="flex-1">
            {/* Header */}
            <div className="flex flex-col mb-4 gap-4">
              <h1 className="text-2xl font-bold text-gray-800">
                Asset Dashboard
              </h1>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors shadow text-sm font-semibold"
                >
                  <Plus size={18} />
                  Add Asset
                </button>

                {/* --- 6. REPLACE OLD BUTTON WITH NEW BUTTONS --- */}
                <div className="flex gap-2">
                  <button
                    onClick={handleOpenCustomerTree}
                    className="flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 px-3 py-2 rounded-lg transition-colors shadow-sm text-sm font-semibold"
                  >
                    <GitBranch size={16} />
                    View Customer Tree
                  </button>
                  <button
                    onClick={handleOpenFdhTree}
                    className="flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 px-3 py-2 rounded-lg transition-colors shadow-sm text-sm font-semibold"
                  >
                    <Spline size={16} />
                    View FDH Tree
                  </button>
                </div>
                {/* --- END OF REPLACEMENT --- */}
              </div>
            </div>

            {/* Filter Box */}
            <FilterBox
              filterInputs={filterInputs}
              onInputChange={handleInputChange}
              onApplyFilters={handleApplyFilters}
              onClearFilters={handleClearFilters}
            />

            {/* --- Asset List (Collapsible UI) --- */}
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
                        onEdit={handleEditRequest}
                        onDelete={handleDeleteRequest}
                        onSwap={handleSwapRequest}
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
                        onEdit={handleEditRequest}
                        onDelete={handleDeleteRequest}
                        onSwap={handleSwapRequest}
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
                        onEdit={handleEditRequest}
                        onDelete={handleDeleteRequest}
                        onSwap={handleSwapRequest}
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
                        onEdit={handleEditRequest}
                        onDelete={handleDeleteRequest}
                        onSwap={handleSwapRequest}
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

          {/* Stats Summary (Right Side) */}
          <div className="lg:w-64">
            <StatsSummary assets={displayAssets} />
          </div>
        </div>
      </div>

      {/* --- Render Modals --- */}
      <AddAssetModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        availableSplitters={availableSplitters}
        onSuccess={handleAddSuccess}
      />

      {/* --- 7. REPLACE OLD MODAL WITH NEW --- */}
      {isTreeModalOpen && (
        <AssetTreeModal
          type={treeModalType}
          id={null} // Pass null to make it ask for an ID
          onClose={handleCloseTreeModal}
        />
      )}

      <SwapAssetModal
        isOpen={!!assetToSwap}
        onClose={() => setAssetToSwap(null)}
        onSuccess={handleSwapSuccess}
        currentAsset={assetToSwap}
      />

      <EditAssetModal
        isOpen={!!assetToEdit}
        onClose={handleCloseEditModal}
        onSave={handleSaveEdit}
        asset={assetToEdit}
        availableSplitters={availableSplitters}
      />

      <ConfirmationModal
        isOpen={!!assetToDelete}
        onClose={() => setAssetToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Asset?"
      >
        <p>
          Are you sure you want to delete this asset?
          <br />
          <strong>
            {assetToDelete?.model} (ID: {assetToDelete?.id})
          </strong>
        </p>
        <p className="mt-2 text-sm text-red-600">
          This action cannot be undone.
        </p>
      </ConfirmationModal>
    </>
  );
}
