import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

export const app = express();

//! middleware setup 

// setup json allow on request
app.use(express.json({
    limit: process.env.LIMIT,

}));

// setup cors for security 
app.use(cors({
    origin: process.env.ORIGIN,
    credentials: true
}));

// setup urlencoded 
app.use(express.urlencoded({
    limit: process.env.LIMIT,
    extended: true,
}))

// setup static folder
app.use(express.static("public"));

// setup cookieParser 
app.use(cookieParser());


// routes setup 
import { userRouter } from "./routes/user.routes.js";

app.use("/api/v1/users",userRouter);