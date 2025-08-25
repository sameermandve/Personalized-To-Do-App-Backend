import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { newList, getListById, getAllLists, updateListName, deleteSelectedList } from "../controllers/list.controller.js";

import { todoRouter } from "./todoRouter.route.js";

const listRouter = Router();

listRouter.use("/:listId/todos", todoRouter);

listRouter.route("/")
    .get(verifyJWT, getAllLists)
    .post(verifyJWT, newList);

listRouter.route("/:listId")
    .get(verifyJWT, getListById)
    .patch(verifyJWT, updateListName)
    .delete(verifyJWT, deleteSelectedList);


// --- Export Routes ---

export { listRouter }