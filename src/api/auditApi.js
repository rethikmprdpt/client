import apiClient from "./axios"; // Assuming this is your axios client path

export const getAuditLogs = (filters = {}) => {
  // Create query parameters from the filters object
  const params = new URLSearchParams();
  if (filters.user_id) {
    params.append("user_id", filters.user_id);
  }
  if (filters.days_ago) {
    params.append("days_ago", filters.days_ago);
  }

  // Send the request
  return apiClient.get("/audit-logs", { params });
};

export const exportAuditLogs = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.user_id) {
    params.append("user_id", filters.user_id);
  }
  if (filters.days_ago) {
    params.append("days_ago", filters.days_ago);
  }

  try {
    const response = await apiClient.get("/audit-logs/export-csv", {
      params,
      responseType: "blob", // Important: tell axios to expect file data
    });

    // Create a URL for the blob data
    const url = window.URL.createObjectURL(new Blob([response.data]));

    // Create a temporary link element to trigger the download
    const link = document.createElement("a");
    link.href = url;

    // Get timestamp for a unique filename
    const timestamp = new Date()
      .toISOString()
      .slice(0, 19)
      .replace("T", "_")
      .replace(/:/g, "-");
    link.setAttribute("download", `audit_logs_${timestamp}.csv`);

    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();

    // Clean up
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Failed to export CSV:", error);
    // Handle error (e.g., show a notification to the user)
    // You might need to read the blob data as JSON if it's an error
    if (error.response && error.response.data.type === "application/json") {
      const errText = await error.response.data.text();
      const errJson = JSON.parse(errText);
      throw new Error(errJson.detail || "CSV Export failed");
    }
    throw new Error("CSV Export failed. Check network request.");
  }
};
