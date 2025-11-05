import apiClient from "./axios";

export const fetchAssets = async () => {
  try {
    const response = await apiClient.get("/inventory");
    return response.data;
  } catch (error) {
    console.error("Error fetching assets:", error);
    return { error: "could not fetch assets" };
  }
};

export const createAsset = async (assetData) => {
  try {
    const response = await apiClient.post("/assets/", assetData);
    return response.data;
  } catch (error) {
    console.error("Error creating asset:", error);
    throw error;
  }
};

export const updateAsset = async (asset) => {
  const { asset_id, ...dataToUpdate } = asset;

  try {
    const response = await apiClient.patch(`/assets/${asset_id}`, dataToUpdate);
    return response.data;
  } catch (error) {
    console.error(`Error updating asset ${asset_id}:`, error);
    throw error;
  }
};

export const deleteAsset = async (assetId) => {
  try {
    const response = await apiClient.delete(`/assets/${assetId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting asset ${assetId}:`, error);
    throw error;
  }
};
