import apiClient from "./axios"; // Assuming your pre-configured axios client is here

export const getTechnicians = () => {
  return apiClient.get("/users", {
    params: { role: "Technician" },
  });
};

export const getAllUsers = () => {
  return apiClient.get("/users/all");
};
