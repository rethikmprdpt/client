import apiClient from "./axios"; // Assuming your pre-configured axios client is here

export const getTechnicians = () => {
  return apiClient.get("/users", {
    params: { role: "Technician" },
  });
};

export const getAllUsers = () => {
  return apiClient.get("/users/all");
};

export const createUser = (userData) => {
  return apiClient.post("/users", userData);
};

export const updateUserRole = (userId, roleData) => {
  return apiClient.patch(`/users/${userId}/role`, roleData);
};
