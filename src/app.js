import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// An instance of the Express application
const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));

// Middleware to parse incoming JSON payloads(data). 
// This allows you to access request data via `req.body`.
app.use(express.json({ limit: "16kb" }));

// Middleware to parse incoming URL-encoded payloads
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Middleware to serve static files (like images) from a directory named "public".
app.use(express.static("public"));

// Middleware to parse and manage cookies sent from the client.
app.use(cookieParser());

// --- Route Handling ---

import { authUser } from "./routes/user.route.js";

import { ApiError } from "./utils/ApiError.js";

// Any request to a URL starting with "/api/v1/users" will be handled by the `authUser` router.
app.use("/api/v1/users", authUser);


const errorHandler = async (err, req, res, next) => {

    if (err instanceof ApiError) {

        return res
            .status(err.statusCode)
            .json({
                statusCode: err.statusCode,
                success: false,
                message: err.message,
                errors: err.errors || [],
            });

    }

    console.log("Unknown Error: ", err);
    return res
        .status(500)
        .json({
            success: false,
            message: "Internal server error",
        });

}

app.use(errorHandler);


// --- Export the App ---

export { app };