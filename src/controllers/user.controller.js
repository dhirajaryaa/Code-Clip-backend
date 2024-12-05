import { AsyncHandler } from '../utils/AsyncHandler.js';
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js"
import { uploadFileOnCloudinary } from "../services/cloudinary.service.js"
import jwt from "jsonwebtoken";

// generate Access token 
const generateAccessAndRefreshToken = async (userId) => {
    // find user form id 
    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "unable to find user!");
    }

    // generate token 
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    // update token on user object 
    if (refreshToken) {
        user.refreshToken = refreshToken
    };
    await user.save();
    // return token 
    return { accessToken, refreshToken };
};

// options for cookie parser security
let cookieOptions = {
    httpOnly: true,
    secure: true
}

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
    return res.status(201).json(new ApiResponse(201, createdUser, "successfully create user"))

});

// login user
const loginUser = AsyncHandler(async (req, res) => {
    //! TODO
    // get data from frontend [email/username and password ]
    const { email, username, password } = req.body;
    // check given data null or empty 
    if (!(email || username)) {
        throw new ApiError(400, "Email or Username is Required ");
    }
    if (!password) {
        throw new ApiError(400, "Password is Required ");
    }
    // check user exists or not 
    const existsUser = await User.findOne({
        $or: [{ email }, { username }],
    }).select("+password");

    if (!existsUser) {
        throw new ApiError(404, "User Not Found!");
    }
    // check password correct or not 
    const isPasswordValid = await existsUser.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "password not correct ");
    }
    // generate accessToken and requestToken 

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(existsUser._id);
    // remove password and refresh token 
    const userData = await User.findById(existsUser._id).select("-password -refreshToken");
    // return res and cookies  
    return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(
            new ApiResponse(200, {
                user: userData,
                accessToken,
                refreshToken
            }, "User Login successful!")
        )
});

// logout user  
const logoutUser = AsyncHandler(async (req, res) => {

    //  update refresh token on user object 
    await User.findByIdAndUpdate(req?.user?._id, {
        $set: { refreshToken: undefined }
    },
        {
            new: true
        });
    // return response with clearCookies 
    return res
        .status(200)
        .clearCookie("accessToken", cookieOptions)
        .clearCookie("refreshToken", cookieOptions)
        .json(
            new ApiResponse(200, {}, "Logout successful!")
        )
});

// refresh Access Token 
const refreshAccessToken = AsyncHandler(async (req, res) => {
    // get cookies from req 
    const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
    if (!incomingRefreshToken) {
        throw new ApiError(401, "UnAuthorized Access")
    };
    // decode cookies and get userid 
    const decodedToken = await jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    if (!decodedToken) {
        throw new ApiError(401, "Invalid Token");
    };
    // fetch user data using id 
    //? by default sensitive data not selected on using select method to select +dataName
    const currentUser = await User.findById(decodedToken?._id).select("+refreshToken");
    // new generate token
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(currentUser._id);
    // update refresh token on user collection 
    currentUser.refreshToken = refreshToken
    await currentUser.save({ validateBeforeSave: false });
    // return response with cookies 
    return res
        .status(201)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(
            new ApiResponse(201, {
                accessToken,
                refreshToken
            }, "Token Refresh Successfully")
        )
});

// get current user 
const currentUser = AsyncHandler(async (req, res) => {
    // get data from req and return
    return res
        .status(200)
        .json(
            new ApiResponse(200, req?.user, "Current User data fetched!")
        )

});

// change password 
const updatePassword = AsyncHandler(async (req, res) => {
    // get data from req.body 
    const { oldPassword, newPassword } = req.body;
    // check data empty or null 
    if (!(oldPassword && newPassword)) {
        throw new ApiError(400, "All Fields are Required");
    };
    // password match 
    const currentUser = await User.findById(req.user._id);
    const isPasswordCorrect = await currentUser.isPasswordCorrect(oldPassword);
    if (!isPasswordCorrect) {
        throw new ApiError(401, "Password not matched!");
    };
    // update password 
    // remove password and refresh token form response 
    const updatedUser = await User.findByIdAndUpdate(currentUser?._id, {
        $set: {
            password: newPassword
        }
    }, {
        new: true
    }).select("-password -refreshToken");
    // return res 
    return res
        .status(201)
        .json(
            new ApiResponse(201, updatedUser, "Password updated successfully!")
        )
});

export { registerUser, loginUser, logoutUser, refreshAccessToken, currentUser, updatePassword };