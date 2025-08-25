import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { List } from "../models/list.model.js";
import { Todo } from "../models/todo.model.js";


const addTodo = asyncHandler(async (req, res) => {

    const { listId } = req.params;
    const { title, description, priority, due_date } = req.body;
    const userId = req.user?._id;

    if (title?.trim() === "") {
        throw new ApiError(400, "Title field is required");
    }

    if (!due_date) {
        throw new ApiError(400, "Due date field is required");
    }

    const parentList = await List.findOne({
        _id: listId,
        userId: userId,
    });

    if (!parentList) {
        throw new ApiError(404, "List not found or you don't have permission to update list");
    }

    const newTodo = new Todo({
        listId,
        title,
        description,
        priority,
        due_date,
    });

    await newTodo.save();

    if (!newTodo) {
        throw new ApiError(500, "Error while creating a todo");
    }

    parentList.todos.push(newTodo._id);
    await parentList.save();

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                newTodo,
                "Todo created successfully"
            )
        );

});

const fetchSelectedTodo = asyncHandler(async (req, res) => {

    const { todoId } = req.params;
    const userId = req.user?._id;

    const todo = await Todo.findById(todoId);

    if (!todo) {
        throw new ApiError(404, "Todo not found");
    }

    const parentList = await List.findOne({
        _id: todo.listId,
        userId: userId,
    });

    if (!parentList) {
        throw new ApiError(403, "You don't have permission to access this todo");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                todo,
                "Todo fetched successfully",
            )
        );

});

const deleteTodo = asyncHandler(async (req, res) => {

    const { todoId } = req.params;
    const userId = req.user?._id;

    const todo = await Todo.findById(todoId);

    if (!todo) {
        throw new ApiError(404, "Todo not found");
    }

    const parentList = await List.findOne({
        _id: todo.listId,
        userId: userId,
    });

    if (!parentList) {
        throw new ApiError(403, "You don't have permission to delete this todo");
    }

    await Todo.findByIdAndDelete(todoId);

    await List.findByIdAndUpdate(
        todo.listId,
        {
            $pull: {
                todos: todoId,
            }
        }
    );

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Todo deleted successfully",
            )
        );

});

const toogleTodoCompletion = asyncHandler(async (req, res) => {

    const { todoId } = req.params;
    const userId = req.user?._id;

    const todo = await Todo.findById(todoId);

    if (!todo) {
        throw new ApiError(404, "Todo not found");
    }

    const parentList = await List.findOne({
        _id: todo.listId,
        userId: userId,
    });

    if (!parentList) {
        throw new ApiError(403, "You don't have permission to update this todo");
    }

    const toggleCompletionState = todo.isComplete;

    const updatedTodo = await Todo.findByIdAndUpdate(
        todoId,
        {
            $set: {
                isComplete: !toggleCompletionState,
            }
        },
        {
            new: true,
        }
    );

    if (!updatedTodo) {
        throw new ApiError(500, "Something went wrong while updating todo");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updatedTodo,
                "Todo marked as complete",
            )
        );

});

export {
    addTodo,
    deleteTodo,
    toogleTodoCompletion,
    fetchSelectedTodo,
}