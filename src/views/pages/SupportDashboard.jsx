import React, { useState } from "react";
import {
  getCustomerDeactivationDetails,
  deactivateCustomer,
} from "../../api/customerApi.js";
import { Loader2 } from "lucide-react";

// --- Confirmation Modal Component ---
const ConfirmationModal = ({ onCancel, onConfirm, isDeactivating }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-md m-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:h-10 sm:w-10">
              {/* Alert Triangle Icon */}
              <svg
                className="h-6 w-6 text-red-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">
                Deactivate Customer
              </h3>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              Are you sure you want to deactivate this customer? All their
              provisioned assets (Port, ONT, Router) will be de-assigned, and
              their status will be set to 'Inactive'.
            </p>
            <p className="text-sm font-semibold text-red-600 mt-2">
              This action is irreversible.
            </p>
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 rounded-b-lg">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeactivating}
            className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeactivating}
            className="px-4 py-2 bg-red-600 text-white rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:bg-red-300 flex items-center"
          >
            {isDeactivating && (
              <Loader2 size={16} className="animate-spin mr-2" />
            )}
            {isDeactivating ? "Deactivating..." : "Confirm Deactivation"}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Customer Details Card Component ---
const CustomerDetailsCard = ({ details, onDeactivateClick }) => {
  const { customer, provisioning } = details;
  const { port, ont_asset, router_asset } = provisioning;

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden mt-6 border border-gray-200">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">{customer.name}</h2>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              customer.status === "Active"
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {customer.status}
          </span>
        </div>

        {/* --- Customer Info --- */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-3 border-b pb-2">
            Customer Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-sm">
            <p className="text-gray-700">
              <span className="font-medium text-gray-900">Customer ID:</span>{" "}
              {customer.customer_id}
            </p>
            <p className="text-gray-700">
              <span className="font-medium text-gray-900">Plan:</span>{" "}
              {customer.plan}
            </p>
            <p className="text-gray-700 col-span-2">
              <span className="font-medium text-gray-900">Address:</span>{" "}
              {customer.address}
            </p>
            <p className="text-gray-700">
              <span className="font-medium text-gray-900">Pincode:</span>{" "}
              {customer.pincode}
            </p>
            <p className="text-gray-700">
              <span className="font-medium text-gray-900">Onboarded:</span>{" "}
              {new Date(customer.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* --- Provisioning Info --- */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-3 border-b pb-2">
            Provisioning Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-sm">
            <p className="text-gray-700">
              <span className="font-medium text-gray-900">FDH:</span>{" "}
              {port?.splitter?.fdh?.model || "N/A"} (ID:{" "}
              {port?.splitter?.fdh?.fdh_id || "N/A"})
            </p>
            <p className="text-gray-700">
              <span className="font-medium text-gray-900">Splitter:</span>{" "}
              {port?.splitter?.model || "N/A"} (ID:{" "}
              {port?.splitter?.splitter_id || "N/A"})
            </p>
            <p className="text-gray-700">
              <span className="font-medium text-gray-900">Port ID:</span>{" "}
              {port?.port_id || "N/A"}
            </p>
            <p className="text-gray-700">
              <span className="font-medium text-gray-900">ONT:</span>{" "}
              {ont_asset?.serial_number || "N/A"} (ID:{" "}
              {ont_asset?.asset_id || "N/A"})
            </p>
            <p className="text-gray-700">
              <span className="font-medium text-gray-900">Router:</span>{" "}
              {router_asset?.serial_number || "N/A"} (ID:{" "}
              {router_asset?.asset_id || "N/A"})
            </p>
          </div>
        </div>

        {/* --- Action Button --- */}
        <div className="border-t pt-5">
          <button
            onClick={onDeactivateClick}
            disabled={customer.status === "Inactive"}
            className="w-full px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:bg-gray-300"
          >
            {customer.status === "Inactive"
              ? "Customer Already Inactive"
              : "Deactivate Customer"}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main Support Dashboard Component ---
const SupportDashboard = () => {
  const [searchInput, setSearchInput] = useState("");
  const [customerDetails, setCustomerDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState({ message: "", type: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeactivating, setIsDeactivating] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchInput) {
      setFeedback({ message: "Please enter a Customer ID.", type: "error" });
      return;
    }

    setIsLoading(true);
    setFeedback({ message: "", type: "" });
    setCustomerDetails(null);

    try {
      const response = await getCustomerDeactivationDetails(searchInput);
      setCustomerDetails(response.data);
    } catch (error) {
      console.error(error);
      const errorMsg =
        error.response?.data?.detail ||
        "Customer not found or failed to load details.";
      setFeedback({ message: errorMsg, type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmDeactivate = async () => {
    if (!customerDetails) return;

    setIsDeactivating(true);
    setFeedback({ message: "", type: "" });

    try {
      const customerId = customerDetails.customer.customer_id;
      await deactivateCustomer(customerId);
      setFeedback({
        message: `Customer ${customerId} has been successfully deactivated.`,
        type: "success",
      });

      // Clear results
      setCustomerDetails(null);
      setSearchInput("");
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      const errorMsg =
        error.response?.data?.detail ||
        "Deactivation failed. Please try again.";
      // Set feedback on main page, close modal
      setFeedback({ message: errorMsg, type: "error" });
      setIsModalOpen(false);
    } finally {
      setIsDeactivating(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-inter">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">
        Support Dashboard
      </h1>
      <p className="text-gray-600 mb-6">
        Enter a Customer ID to view their details and manage their activation
        status.
      </p>

      {/* --- Search Bar --- */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <form onSubmit={handleSearch} className="flex space-x-3">
          <input
            type="number"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Enter Customer ID..."
            className="flex-grow px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-5 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300 flex items-center justify-center"
          >
            {isLoading && <Loader2 size={16} className="animate-spin mr-2" />}
            {isLoading ? "Searching..." : "Search"}
          </button>
        </form>
      </div>

      {/* --- Feedback Area --- */}
      {feedback.message && (
        <div
          className={`p-4 rounded-md mt-6 ${
            feedback.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {feedback.message}
        </div>
      )}

      {/* --- Results Area --- */}
      {!isLoading && !customerDetails && !feedback.message && (
        <div className="text-center p-10 mt-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-500">
            Search for a customer to see their details.
          </p>
        </div>
      )}

      {customerDetails && (
        <CustomerDetailsCard
          details={customerDetails}
          onDeactivateClick={() => setIsModalOpen(true)}
        />
      )}

      {/* --- Confirmation Modal --- */}
      {isModalOpen && (
        <ConfirmationModal
          onCancel={() => setIsModalOpen(false)}
          onConfirm={handleConfirmDeactivate}
          isDeactivating={isDeactivating}
        />
      )}
    </div>
  );
};

export default SupportDashboard;
