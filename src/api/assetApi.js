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

export const createAsset = async (submissionData) => {
  const { assetType, mode, formData, file } = submissionData;

  if (mode === "csv") {
    const csvFormData = new FormData();
    csvFormData.append("file", file);
    csvFormData.append("assetType", assetType);

    const endpoint = `/assets/batch-csv-upload`;

    try {
      const response = await apiClient.post(endpoint, csvFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error creating ${assetType} from CSV:`, error);
      throw error;
    }
  }

  const endpoint = "/assets";
  let payloadData = {};

  switch (assetType) {
    case "ONT":
      payloadData = {
        model: formData.model,
        serial_number: formData.serial,
      };
      break;

    case "Router":
      payloadData = {
        model: formData.model,
        serial_number: formData.serial,
      };
      break;

    case "Splitter":
      payloadData = {
        model: formData.model,
        serial_number: formData.serial,
        max_ports: formData.ratio,
      };
      break;

    case "FDH":
      payloadData = {
        model: formData.model,
        pincode: formData.pincode,
        latitude: formData.latitude,
        longitude: formData.longitude,
        splitter_ids_to_assign: formData.selectedSplitters,
      };
      break;

    default:
      console.error("Unknown asset type:", assetType);
      throw new Error("Unknown asset type for creation.");
  }

  // --- FIX: Construct the final payload as requested ---
  const finalPayload = {
    assetType: assetType,
    data: payloadData,
  };

  try {
    const response = await apiClient.post(endpoint, finalPayload);
    return response.data;
  } catch (error) {
    console.error(`Error creating ${assetType}:`, error);
    throw error;
  }
};

export const updateAsset = async (assetType, assetId, formData) => {
  // --- FIX: Use a single endpoint format ---
  const endpoint = `/assets/${assetId}`;

  // --- FIX: Construct the payload with assetType in the body ---
  const payload = {
    assetType: assetType,
    data: formData, // formData is the full, updated originalData object
  };

  try {
    const response = await apiClient.patch(endpoint, payload);
    return response.data;
  } catch (error) {
    console.error(`Error updating ${assetType} ${assetId}:`, error);
    throw error;
  }
};

export const deleteAsset = async (assetType, assetId) => {
  // --- FIX: Use a single endpoint format ---
  const endpoint = `/assets/${assetId}`;

  // --- FIX: Construct the payload for the DELETE request body ---
  const payload = {
    assetType: assetType,
  };

  try {
    // For axios, a DELETE request with a body uses the `data` key
    const response = await apiClient.delete(endpoint, { data: payload });
    return response.data; // Or return a success message
  } catch (error) {
    console.error(`Error deleting ${assetType} ${assetId}:`, error);
    throw error;
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
