import apiClient from "./axios";

export const getAvailableAssets = (assetType) => {
  if (!assetType) {
    return Promise.reject(new Error("Asset type is required"));
  }

  return apiClient.get("/assets", {
    params: {
      asset_type: assetType,
      asset_status: "available",
    },
  });
};

export const fetchAssets = async () => {
  try {
    const response = await apiClient.get("/inventory");
    return response.data;
  } catch (error) {
    console.error("Error fetching assets:", error);
    throw error; // Re-throw to be caught by the component
  }
};

export const fetchCustomerBranch = async (customerId) => {
  try {
    const response = await apiClient.get(`/customer-branch/${customerId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching branch for customer ${customerId}:`, error);
    throw error;
  }
};

export const fetchAffectedCustomers = async (nodeType, nodeId) => {
  try {
    const response = await apiClient.get(
      `/affected-customers?type=${nodeType}&id=${nodeId}`
    );
    return response.data; // Expects an array of customer objects
  } catch (error) {
    console.error(
      `Error fetching affected customers for ${nodeType} ${nodeId}:`,
      error
    );
    throw error;
  }
};

export const createAsset = (assetData) => {
  return apiClient.post("/assets/", assetData);
};

export const createAssetsBulk = (assetsData) => {
  return apiClient.post("/assets/bulk", assetsData);
};

// --- UPDATE ---

export const updateAsset = (assetId, assetData) => {
  return apiClient.patch(`/assets/${assetId}`, assetData);
};

// --- DELETE ---

export const deleteAsset = (assetId) => {
  return apiClient.delete(`/assets/${assetId}`);
};

export const swapAsset = (swapData) => {
  return apiClient.post("/assets/swap", swapData);
};
