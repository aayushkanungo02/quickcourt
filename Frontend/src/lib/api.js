import { axiosInstance } from "./axios";

export const getAuthUser = async () => {
  try {
    const response = await axiosInstance.get("/auth/me");
    return response.data; // Assuming the response data contains the authenticated user information
  } catch (error) {
    if (error?.response?.status !== 401) {
      console.log("error in getAuthUser", error?.message || error);
    }
    return null;
  }
};

