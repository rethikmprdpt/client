import apiClient from "./axios";

export const onboardCustomer = (customerData) => {
  return apiClient.post("/customers", customerData);
};

export const getCustomersByStatus = (status) => {
  return apiClient.get("/customers", {
    params: { status },
  });
};

export const getCustomerProvisioningDetails = (customerId) => {
  return apiClient.get(`/customers/${customerId}/provisioning-details`);
};

export const getCustomerDeactivationDetails = (customerId) => {
  return apiClient.get(`/customers/${customerId}/deactivation-details`);
};

export const deactivateCustomer = (customerId) => {
  return apiClient.post(`/customers/${customerId}/deactivate`);
};
