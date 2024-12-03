import { connectDB } from "./db/index.js"
import { app } from "./app.js";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

// dotenv configure
dotenv.config({
    path: "./.env"
});

//cloudinary configure
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME ,
    api_key: process.env.CLOUDINARY_API_KEY ,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

//! database connect and server setup 
connectDB()
    .then(() => {
        app.on('error', (err) => {
            console.error('Express Server Error=> ' + err);
            process.exit(1);
        });
        // server listening on port 
        app.listen(process.env.PORT || 4000, () => {

            console.log("Server Listening on Port => " + process.env.PORT || 4000);

        })

    })
    .catch((error) => {
        console.error("MongoDB connection Failure => " + error);
        process.exit(1);
    });

