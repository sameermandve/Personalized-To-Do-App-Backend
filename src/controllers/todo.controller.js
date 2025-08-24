import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Todo } from "../models/todo.model.js";


const addTodoTask = asyncHandler(async (req, res) => {

    const { title, description,  } = req.body;

});

export {
    addTodoTask,
}