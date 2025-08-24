import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addTodoTask } from "../controllers/todo.controller.js";


const todoRouter = Router({ mergeParams: true });

todoRouter.route("/add").post(verifyJWT, addTodoTask);


// --- Export Routes ---

export { todoRouter };