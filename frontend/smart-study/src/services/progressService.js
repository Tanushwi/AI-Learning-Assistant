import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

const getDashboardData = async () => {

  try {

    const response = await axiosInstance.get(
      API_PATHS.PROGRESS.GET_DASHBOARD
    );

    return response.data;

  } catch (error) {

    const responseData = error.response?.data;

    const message =
      responseData?.error ||
      responseData?.message ||
      error.message ||
      "Failed to fetch dashboard data";

    throw { message, ...responseData };

  }

};

const progressService = {
  getDashboardData,
};

export default progressService;