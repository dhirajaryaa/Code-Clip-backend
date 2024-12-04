import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js"
import jwt from "jsonwebtoken";

//  write custom middleware to extract user info using cookies
export const verifyJWT = AsyncHandler(async (req, res, next) => {
    try {
        // TODO 
        // get cookie from req 
        const Token = req.cookies?.accessToken || req.headers?.["authorization"]?.replace("Bearer ", "");
    
        // check cookie present or not
        if (!Token) {
            throw new ApiError(401, "Unauthorized Access!");
        }
        // decode cookie and extract user data 
        const decodedToken = jwt.verify(Token, process.env.ACCESS_TOKEN_SECRET);
    
        // fetch user data form database 
        const user = await User.findById(decodedToken.id).select("-password -refreshToken");
        // pass user throw request
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, "Invalid or Expired token!");
    }
});