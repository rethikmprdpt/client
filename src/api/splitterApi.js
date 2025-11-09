import apiClient from "./axios";

export const getPortsForSplitter = (splitterId) => {
  return apiClient.get(`/splitters/${splitterId}/ports`);
};
