import { AsyncHandler } from '../utils/AsyncHandler.js';
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js"
import { uploadFileOnCloudinary } from "../services/cloudinary.service.js"


// register user 
const registerUser = AsyncHandler(async (req, res) => {
    //! TODO
    // get data form frontend 
    const { username, fullName, email, status, password } = req.body;

    // check given data is empty or null 
    if ([username, fullName, email, status, password].some((val) => val.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }
    // check user already exists or not
    const existedUser = await User.findOne({
        $or: [{ email }, { username }]
    });

    if (existedUser) {
        throw new ApiError(409, "User Already Exists");
    }
    // get avatar and coverImage path form req
    const avatarLocalPath = req.files?.avatar[0]?.path;
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required");
    }

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files?.coverImage[0]?.path;
    };
    // upload avatar and coverImage on cloudinary
    const avatar = await uploadFileOnCloudinary(avatarLocalPath);

    const coverImage = await uploadFileOnCloudinary(coverImageLocalPath);
    // check avatar and coverImage uploaded or not
    if (!avatar) {
        throw new ApiError(400, "Failed to upload avatar to Cloudinary");
    }
    // create user object and upload on DB 
    const userObject = {
        username: username.toLowerCase(),
        fullName,
        email,
        password,
        avatar,
        coverImage: coverImage || "",
        status
    };
    const userData = await User.create(userObject);

    // remove password and refreshToken on response 
    const createdUser = await User.findById(userData._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(500, "Failed to save user data to MongoDB. Please try again later.");
    };
    // return api response 
    return res.status(201).json(new ApiResponse(201, createdUser,"successfully create user"))

});

export { registerUser }