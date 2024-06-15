import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { ApiError } from "./ApiError.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    //upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    // file has been uploaded successfull
    //console.log("file is uploaded on cloudinary ", response.url);
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); // remove the locally saved temporary file as the upload operation got failed
    return null;
  }
};

const deleteOnCloudinary = async (oldUrl, publicId) => {
  try {
    if (!(oldUrl || publicId)) {
      throw new ApiError(404, "Old Url or publicId is required");
    }

    const res = await cloudinary.uploader.destroy(publicId, {
      resource_type: `${oldUrl.includes("image") ? "image" : "video"}`,
    });
    console.log("Asset deleted from Cloudinary:", res);
  } catch (error) {
    console.error("Error deleting asset from Cloudinary", error);
    throw new ApiError(500, error?.message || "Server error");
  }
};

export { uploadOnCloudinary, deleteOnCloudinary };
