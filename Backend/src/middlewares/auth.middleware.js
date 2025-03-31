import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";

/**
 * @desc Verify JWT token
 * @access Private (User)
 */
export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        // Get token from cookies or headers
        const token =
            req.cookies.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            throw new ApiError(401, "Unauthorized Request No Token Found");
        }
        // Decode token
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        // Find user based on token id
        const user = await User.findById(decodedToken._id).select(
            "-password -refreshToken"
        );
        if (!user) {
            throw new ApiError(401, "Invalid Access Token");
        }
        req.user = user; // Attach user to request object
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Unauthorized Request");
    }
});

export const verifyStudent = asyncHandler(async(req,_,next) =>{
    if(req.user.role !== "student"){
        throw new ApiError(403,"Forbidden: You do not have permission to access this resource.")
    }
    next();
});

export const verifyTeacher = asyncHandler(async (req, _, next) => {
    if (req.user.role !== "teacher") {
        throw new ApiError(403, "Forbidden: You do not have permission to access this resource.");
    }
    next();
});

export const verifyCoordinator = asyncHandler(async (req, _, next) => {
    if (req.user.role !== "coordinator") {
        throw new ApiError(403, "Forbidden: You do not have permission to access this resource.");
    }
    next();
});

export const verifySuperAdmin = asyncHandler(async (req, _, next) => {
    if (req.user.role !== "super admin") {
        throw new ApiError(403, "Forbidden: You do not have permission to access this resource.");
    }
    next();
});

