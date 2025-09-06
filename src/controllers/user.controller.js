import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { generateToken } from "../utils/generateToken.js";
import { uploadOnCloudinary, destroyOldImage } from "../utils/cloudinary.js";

const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    return emailRegex.test(email);
}

const registerUser = asyncHandler(async (req, res) => {

    const { username, email, password } = req.body;

    if (
        [username, email, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(404, "All fields are required");
    }

    if (!isValidEmail(email)) {
        throw new ApiError(404, "Invalid Email");
    }

    if (password.length < 6) {
        throw new ApiError(404, "Password must be at least 6 characters");
    }

    const isUserExist = await User.findOne({ email });

    if (isUserExist) {
        throw new ApiError(404, "User already exists");
    }

    const newUser = new User({
        username,
        email,
        password,
    });

    if (!newUser) {
        throw new ApiError(500, "Something went wrong while registering user");
    }

    if (newUser) {
        generateToken(newUser._id, res);
        await newUser.save();

        return res
            .status(201)
            .json(
                new ApiResponse(
                    201,
                    {
                        _id: newUser._id,
                        username: newUser.username,
                        email: newUser.email,
                        avatar: newUser.avatar,
                    },
                    "User registered successfully",
                )
            );
    } else {
        throw new ApiError(500, "AuthController: Internal Server Error");
    }

});

const loginUser = asyncHandler(async (req, res) => {

    const { email, password } = req.body;

    if (
        [email, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required!");
    }

    if (!isValidEmail(email)) {
        throw new ApiError(400, "Invalid email");
    }

    if (password.length < 6) {
        throw new ApiError(404, "Invalid credentials");
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(404, "Invalid credentials");
    }

    const isValidPassword = await user.isPasswordCorrect(password);

    if (!isValidPassword) {
        throw new ApiError(404, "Invalid credentials");
    }

    generateToken(user._id, res);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    avatar: user.avatar,
                },
                "User logged in successfully"
            )
        );

});

const logoutUser = asyncHandler(async (req, res) => {

    return res
        .status(200)
        .cookie("jwt", "", { maxAge: 0 })
        .json(
            new ApiResponse(
                200,
                {},
                "User logged out successfully"
            )
        );

});

const uploadAvatar = asyncHandler(async (req, res) => {

    const avatarLocalPath = req.file?.path;
    const oldPublicId = req.user?.avatar?.public_id;

    if (!avatarLocalPath) {
        throw new ApiError(404, "Avatar file is missing");
    }

    const newAvatar = await uploadOnCloudinary(avatarLocalPath);

    if (!newAvatar.url || !newAvatar.public_id) {
        throw new ApiError(500, "Error while uploading avatar");
    }

    const updatedUser = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: {
                    url: newAvatar.url,
                    public_id: newAvatar.public_id,
                }
            }
        },
        {
            new: true,
        }
    ).select("-password");

    if (oldPublicId) {
        destroyOldImage(oldPublicId);
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updatedUser,
                "Avatar uploaded successfully"
            )
        );

});

const checkUserAuth = asyncHandler(async (req, res) => {

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                req.user,
                "User data fetched successfully",
            )
        );

});

const deleteUserCompletely = asyncHandler(async (req, res) => {

    const userId = req.user?._id;
    const oldPublicId = req.user?.avatar?.public_id;

    if (!userId) {
        throw new ApiError("User does not exist");
    }

    const deleteUser = await User.findByIdAndDelete(userId);

    if (oldPublicId) {
        destroyOldImage(oldPublicId);
    }

    if (!deleteUser) {
        throw new ApiError(404, "User does not exist");
    }

    return res
        .status(200)
        .clearCookie("jwt")
        .json(
            new ApiResponse(
                200,
                {},
                "User deleted successfully"
            )
        );

});

export {
    registerUser,
    loginUser,
    logoutUser,
    checkUserAuth,
    uploadAvatar,
    deleteUserCompletely,
}