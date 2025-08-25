import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addTodo, deleteTodo, toogleTodoCompletion, fetchSelectedTodo } from "../controllers/Todo.controller.js";


const todoRouter = Router({ mergeParams: true });

todoRouter.route("/add").post(verifyJWT, addTodo);

todoRouter.route("/:todoId").get(verifyJWT, fetchSelectedTodo);

todoRouter.route("/:todoId/delete").delete(verifyJWT, deleteTodo);

todoRouter.route("/:todoId/update").patch(verifyJWT, toogleTodoCompletion);


// --- Export Routes ---

export { todoRouter };