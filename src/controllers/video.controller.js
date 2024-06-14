import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary, deleteOnCloudinary } from "../utils/cloudinary.js";
import { Comment } from "../models/comment.model.js";
import { Playlist } from "../models/playlist.model.js";
import { Like } from "../models/like.model.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  //TODO: get all videos based on query, sort, pagination
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  var videoFile;
  var thumbnail;
  try {
    if (!(title && description) || !(title?.trim() && description?.trim()))
      throw new ApiError(404, "Please provide title and description");

    if (!req.files?.videoFile?.[0]?.path && !req.files?.thumbnail?.[0]?.path)
      throw new ApiError(404, "Please provide video and thumbnail");

    [videoFile, thumbnail] = await Promise.all([
      uploadOnCloudinary(req.files?.videoFile?.[0]?.path),
      uploadOnCloudinary(req.files?.thumbnail?.[0]?.path),
    ]);

    const video = await Video.create({
      title,
      description,
      videoFile: { publicId: videoFile?.public_id, url: videoFile?.url },
      thumbnail: { publicId: thumbnail?.public_id, url: thumbnail?.url },
      owner: req.user?._id,
      duration: videoFile?.duration,
    });

    return res.status(201).json(
      new ApiResponse(
        201,
        {
          ...video._doc,
          videoFile: videoFile?.url, // Only send the URL of the video file
          thumbnail: thumbnail?.url, // Only send the URL of the thumbnail
        },
        "Video Published Successfully"
      )
    );
  } catch (error) {
    try {
      if (videoFile?.url)
        await deleteOnCloudinary(videoFile?.url, videoFile?.public_id);
      if (thumbnail?.url)
        await deleteOnCloudinary(thumbnail?.url, thumbnail?.public_id);
    } catch (error) {
      console.error("Error while deleting video :: ", error);
      throw new ApiError(
        500,
        error?.message || "Server Error while deleting video from cloudinary"
      );
    }
    console.error("Error while publishing video :: ", error);
    throw new ApiError(
      500,
      error?.message || "Server Error while uploading video"
    );
  }
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: get video by id
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: update video details like title, description, thumbnail
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
