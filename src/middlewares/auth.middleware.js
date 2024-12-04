import { AsyncHandler } from "../utils/AsyncHandler";
import { ApiError } from "../utils/ApiError";
import {User} from "../models/user.model.js"
import jwt from "jsonwebtoken";

//  write custom middleware to extract user info using cookies
export const verifyJWT = AsyncHandler(async (req,res,next)=>{
    // TODO 
    // get cookie from req 
    const Token = req.cookies?.accessToken || req.headers?.["authorization"]?.replace("Bearer ","");

    // check cookie present or not
    if(!Token){
        throw new ApiError(401, "Unauthorized Access!");
    }
    // decode cookie and extract user data 
    const decodedToken = jwt.verify(Token,process.env.ACCESS_TOKEN_SECRET);

    // fetch user data form database 
    const user = await User.findById(decodedToken._id).select("-password -refreshToken");
    // pass user throw request
    return req.user = user;
    next();
});