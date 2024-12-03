import { connectDB } from "./db/index.js"
import { app } from "./app.js";
import dotenv from "dotenv";

// dotenv configure
dotenv.config({
    path: "./.env"
});

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

