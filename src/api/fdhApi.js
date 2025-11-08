import apiClient from "./axios"; // Assuming your configured axios client is here

export const getAllFdhs = () => {
  return apiClient.get("/fdhs");
};

export const getSplittersForFdh = (fdhId) => {
  if (!fdhId) {
    return Promise.reject(new Error("FDH ID is required"));
  }

  return apiClient.get(`/fdhs/${fdhId}/splitters`, {
    params: {
      openPortsOnly: true, // Hardcoded to true as per our logic
    },
  });
};
