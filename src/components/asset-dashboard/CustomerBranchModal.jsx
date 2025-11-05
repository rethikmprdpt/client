import { useState, useEffect } from "react";
import {
  X,
  Search,
  Server,
  GitBranch,
  Package,
  Monitor,
  Wifi,
  Loader2,
  AlertTriangle,
  CheckCircle,
  User,
  ZapOff,
  Users,
} from "lucide-react";
// We'll import apiClient like this. Adjust the path as needed.
// import apiClient from "../api/axios";

// --- NEW, MINIMAL DUMMY DATA ---
// This is the new, linear structure your backend should send.
// It only shows the direct path for the searched customer.
const dummyHierarchyData = {
  customer: { id: 1, name: "Arun Kumar" },
  path: {
    type: "FDH",
    id: 1,
    model: "Nokia FX-8",
    subtitle: "FDH ID: 1 | Pincode: 600001",
    status: "active",
    iconName: "Server", // We now pass icon names
    children: [
      {
        type: "Splitter",
        id: 1,
        model: "1:8 Passive",
        subtitle: "Splitter ID: 1 | Ports: 2/8",
        status: "faulty", // FAULTY node to test the "Affected" feature
        iconName: "Package",
        children: [
          {
            type: "ONT",
            id: 1,
            model: "Nokia G-140W-C",
            subtitle: "SN: NK12345678",
            status: "assigned",
            iconName: "Monitor",
            customer: { id: 1, name: "Arun Kumar" },
            children: [
              {
                type: "Router",
                id: 2,
                model: "TP-Link Archer C6",
                subtitle: "SN: TP12345678",
                status: "assigned",
                iconName: "Wifi",
                customer: { id: 1, name: "Arun Kumar" },
                children: [],
              },
            ],
          },
        ],
      },
    ],
  },
};

// --- DUMMY DATA for the *second* fetch ---
const dummyAffectedCustomers = [
  { id: 1, name: "Arun Kumar" },
  { id: 12, name: "Priya Selvam" },
  { id: 22, name: "Ravi Shankar" },
  { id: 34, name: "Meena Iyer" },
];

// --- API Fetch Function 1 (Main tree) ---
const fetchCustomerBranch = async (customerId) => {
  console.log(`Fetching branch for customer: ${customerId}`);

  // This is the function you will uncomment when your backend is ready.
  /*
  try {
    const response = await apiClient.get(`/customer-branch/${customerId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch customer branch:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch data");
  }
  */
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(dummyHierarchyData);
    }, 1000);
  });
};

// --- API Fetch Function 2 (Affected Customers) ---
const fetchAffectedCustomers = async (nodeType, nodeId) => {
  console.log(`Fetching affected customers for ${nodeType} ID: ${nodeId}`);

  // This is the function you will uncomment.
  /*
  try {
    const response = await apiClient.get(`/affected-customers?type=${nodeType}&id=${nodeId}`);
    return response.data; // Should return an array of customer objects
  } catch (error) {
    console.error("Failed to fetch affected customers:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch customers");
  }
  */
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(dummyAffectedCustomers);
    }, 1000);
  });
};

// --- StatusBadge helper (Unchanged) ---
function StatusBadge({ status }) {
  const statusConfig = {
    active: {
      text: "Active",
      color: "bg-green-100 text-green-800",
      icon: <CheckCircle size={14} />,
    },
    in_use: {
      text: "In Use",
      color: "bg-blue-100 text-blue-800",
      icon: <CheckCircle size={14} />,
    },
    assigned: {
      text: "Assigned",
      color: "bg-blue-100 text-blue-800",
      icon: <User size={14} />,
    },
    faulty: {
      text: "Faulty",
      color: "bg-red-100 text-red-800",
      icon: <AlertTriangle size={14} />,
    },
    offline: {
      text: "Offline",
      color: "bg-gray-100 text-gray-800",
      icon: <ZapOff size={14} />,
    },
  };
  const config = statusConfig[status.toLowerCase()] || statusConfig["offline"];

  return (
    <div
      className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${config.color}`}
    >
      {config.icon}
      <span>{config.text}</span>
    </div>
  );
}

// --- NEW: Icon Map ---
const iconMap = {
  Server: <Server size={20} />,
  Package: <Package size={18} />,
  Monitor: <Monitor size={16} />,
  Wifi: <Wifi size={16} />,
};

// --- REFACTORED: Recursive TreeNode Component ---
function TreeNode({
  node,
  isSearchedCustomer,
  onViewAffected,
  isRoot = false,
}) {
  const customerName = node.customer?.name;

  const nodeConfig = {
    FDH: { color: "border-blue-500", icon: iconMap.Server },
    Splitter: { color: "border-green-500", icon: iconMap.Package },
    ONT: { color: "border-yellow-500", icon: iconMap.Monitor },
    Router: { color: "border-purple-500", icon: iconMap.Wifi },
  };

  const config = nodeConfig[node.type] || {
    color: "border-gray-500",
    icon: <GitBranch size={16} />,
  };

  // Check if this node is the one we searched for
  const isHighlight = isSearchedCustomer && !!node.customer;

  return (
    // --- FIX: Indentation and lines are now conditional on NOT being root ---
    <div className={`relative ${!isRoot ? "ml-6 pl-6" : ""}`}>
      {/* Connecting line (only for non-root nodes) */}
      {!isRoot && (
        <>
          {/* Vertical line part */}
          <span className="absolute -left-px top-0 h-full w-0.5 bg-gray-300" />
          {/* Horizontal line part (from line to card) */}
          <span className="absolute -left-px top-7 h-0.5 w-6 bg-gray-300" />
          {/* Dot */}
          <span className="absolute -left-[3px] top-6 w-2 h-2 bg-gray-400 rounded-full border-2 border-white" />
        </>
      )}

      {/* The node card */}
      {/* --- FIX: Added margin-top to all cards for spacing --- */}
      <div
        className={`relative mt-4 border rounded-lg bg-white shadow-sm ${
          config.color
        } border-l-4 ${isHighlight ? "ring-2 ring-blue-500" : ""}`}
      >
        <div className="p-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="text-gray-500">{config.icon}</div>
              <h4 className="font-semibold text-gray-800">{node.model}</h4>
            </div>
            <StatusBadge status={node.status} />
          </div>
          <p className="text-xs text-gray-500 pl-8 pt-1">{node.subtitle}</p>
          {customerName && (
            <p className="text-xs text-blue-700 font-semibold pl-8 pt-1">
              {customerName}
            </p>
          )}

          {/* View Affected Button (only for FDH/Splitter) */}
          {(node.type === "FDH" || node.type === "Splitter") && (
            <button
              onClick={() => onViewAffected(node)}
              className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs hover:bg-gray-200"
            >
              <Users size={14} />
              View Customers
            </button>
          )}
        </div>
      </div>

      {/* Render children (no extra div needed, recursion handles it) */}
      {node.children && node.children.length > 0 && (
        <div className="relative">
          {node.children.map((childNode) => (
            <TreeNode
              key={`${childNode.type}-${childNode.id}`}
              node={childNode}
              isSearchedCustomer={isSearchedCustomer}
              onViewAffected={onViewAffected}
              isRoot={false} // Children are never root
            />
          ))}
        </div>
      )}
    </div>
  );
}

// --- UPDATED: Affected Customers Modal ---
// (This component is unchanged from the previous version)
function AffectedCustomersModal({ isOpen, onClose, node }) {
  const [customerList, setCustomerList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!node) return;

    const loadAffected = async () => {
      setIsLoading(true);
      setError(null);
      setCustomerList([]);
      try {
        const customers = await fetchAffectedCustomers(node.type, node.id);
        setCustomerList(customers);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadAffected();
  }, [node]);

  if (!isOpen || !node) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-60 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-xl shadow-2xl w-full max-w-md h-[500px] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-start justify-between p-4 border-b">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Affected Customers
            </h3>
            <p className="text-sm text-gray-600">
              Showing all customers on {node.type} ({node.model})
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Customer List */}
        <div className="p-4 overflow-y-auto flex-1">
          {isLoading && (
            <div className="flex justify-center items-center h-full">
              <Loader2 size={24} className="animate-spin text-blue-600" />
            </div>
          )}
          {error && <p className="text-red-500 text-center">{error}</p>}
          {!isLoading && !error && customerList.length === 0 && (
            <p className="text-gray-500 text-center pt-8">
              No customers are connected to this node.
            </p>
          )}
          {!isLoading && !error && (
            <div className="space-y-2">
              {customerList.map((customer) => (
                <div
                  key={customer.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-full">
                    <User size={16} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">
                      {customer.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      Customer ID: {customer.id}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CustomerBranchModal({ isOpen, onClose }) {
  const [customerId, setCustomerId] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [isAffectedModalOpen, setIsAffectedModalOpen] = useState(false);
  const [affectedNode, setAffectedNode] = useState(null);

  const handleSearch = async () => {
    setError(null);
    setSearchResult(null);
    setIsLoading(true);

    const idToSearch = parseInt(customerId, 10);
    if (isNaN(idToSearch)) {
      setError("Please enter a valid Customer ID.");
      setIsLoading(false);
      return;
    }

    try {
      const data = await fetchCustomerBranch(idToSearch);
      setSearchResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setCustomerId("");
    setSearchResult(null);
    setError(null);
    setIsLoading(false);
    onClose();
  };

  const handleViewAffected = (node) => {
    setAffectedNode(node);
    setIsAffectedModalOpen(true);
  };

  const handleCloseAffectedModal = () => {
    setIsAffectedModalOpen(false);
    setAffectedNode(null);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      >
        {/* Modal Card */}
        {/* --- FIX: Removed the duplicate/broken <div> tag --- */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl h-[700px] flex flex-col" // Fixed height
        >
          {/* Header (Unchanged) */}
          <div className="flex items-center p-4 border-b">
            <div className="flex items-center gap-3">
              <GitBranch size={20} className="text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                View Customer Branch
              </h3>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <input
                type="text"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                placeholder="Enter Customer ID..."
                className="flex-1 text-sm border-gray-300 rounded-lg"
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <button
                onClick={handleSearch}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:bg-gray-400"
              >
                {isLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Search size={16} />
                )}
              </button>
            </div>
            <button
              onClick={handleClose}
              className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 ml-2"
            >
              <X size={20} />
            </button>
          </div>

          {/* --- MODIFIED: Content Area --- */}
          <div className="p-6 overflow-y-auto flex-1 bg-gray-50">
            {" "}
            {/* flex-1 makes it fill height */}
            {error && <div className="text-center text-red-600">{error}</div>}
            {isLoading && (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <Loader2 size={32} className="animate-spin" />
                <p className="mt-2">Loading customer data...</p>
              </div>
            )}
            {!searchResult && !error && !isLoading && (
              <div className="text-center text-gray-500 pt-16">
                Please enter a Customer ID to view their asset hierarchy.
              </div>
            )}
            {searchResult && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {searchResult.customer.name}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Customer ID: {searchResult.customer.id}
                  </p>
                </div>

                {/* --- NEW: Render the new tree --- */}
                <div className="pt-4">
                  {searchResult.path ? (
                    <TreeNode
                      node={searchResult.path}
                      isSearchedCustomer={true}
                      onViewAffected={handleViewAffected}
                      isRoot={true} // --- FIX: Pass isRoot={true}
                    />
                  ) : (
                    <p className="text-gray-500">
                      No network branch found for this customer.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- Render the "Affected Customers" Modal --- */}
      <AffectedCustomersModal
        isOpen={isAffectedModalOpen}
        onClose={handleCloseAffectedModal}
        node={affectedNode}
      />
    </>
  );
}
