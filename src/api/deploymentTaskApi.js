import apiClient from "./axios"; // Assuming your pre-configured axios client is here

export const createDeploymentTask = (taskData) => {
  return apiClient.post("/deployment-tasks", taskData);
};

export const getDeploymentTasksByStatus = (status) => {
  return apiClient.get("/deployment-tasks", {
    params: { status },
  });
};

export const updateTaskChecklist = (taskId, checklistData) => {
  return apiClient.patch(`/deployment-tasks/${taskId}`, checklistData);
};
