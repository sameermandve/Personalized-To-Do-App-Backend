import { app } from "./app.js";
import connectDB from "./db/database.js";
import dotenv from "dotenv";

dotenv.config({
    path: "./.env",
});

connectDB()
    .then(() => {

        app.on("error", () => {
            console.error("Error: ", error);
        })

        app.listen(process.env.PORT || 8000, () => {
            console.log("Server is running at PORT: ", process.env.PORT);
        })

    })
    .catch((error) => {
        console.error("Error connecting MONGODB: ", error);
    });