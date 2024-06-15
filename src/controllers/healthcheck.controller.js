import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const healthcheck = asyncHandler(async (req, res) => {
  //TODO: build a healthcheck response that simply returns the OK status as json with a message
  try {
    const dbStatus = mongoose.connection.readyState
      ? "db connected"
      : "db disconnected";
    const healthcheck = {
      dbStatus,
      uptime: process.uptime(),
      message: "Ok",
      timestamp: Date.now(),
      hrtime: process.hrtime(),
      serverStatus: `Server is running on port ${process.env.PORT}`,
    };

    return res
      .status(200)
      .json(new ApiResponse(200, healthcheck, "Health check Successfull"));
  } catch (error) {
    const healthcheck = {
      dbStatus,
      uptime: process.uptime(),
      message: "Error",
      timestamp: Date.now(),
      hrtime: process.hrtime(),
      error: error?.message,
    };
    console.error("Error in health check", error);

    return res
      .status(500)
      .json(new ApiResponse(500, healthcheck, "Health check Failed"));
  }
});

export { healthcheck };
