import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { List } from "../models/list.model.js";

const newList = asyncHandler(async (req, res) => {

    const { listName, listDesc } = req.body;
    const user = req.user?._id;

    if (!listName?.trim()) {
        throw new ApiError(400, "List name cannot be empty");
    }

    if (!listDesc?.trim()) {
        throw new ApiError(400, "List description cannot be empty");
    }

    const newCreatedList = new List({
        userId: user,
        listName,
        listDesc,
    });

    await newCreatedList.save();

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                newCreatedList,
                "New List created successfully"
            )
        );

});

const getListById = asyncHandler(async (req, res) => {

    const { listId } = req.params;
    const userId = req.user?._id;

    const selectedList = await List.findOne({
        _id: listId,
        userId: userId,
    }).populate("todos");
    
    if (!selectedList) {
        throw new ApiError(404, "List not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                selectedList,
                "Selected list fetched successfully"
            )
        );

});

const getAllLists = asyncHandler(async (req, res) => {

    const loggedInUser = req.user?._id;

    const fetchAllLists = await List.find({ userId: loggedInUser });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                fetchAllLists,
                "Fetched all available list of user successfully"
            )
        );

});

const updateListName = asyncHandler(async (req, res) => {

    const { listName } = req.body;
    const { listId } = req.params;
    const user = req.user?._id;

    if (!listName?.trim()) {
        throw new ApiError(400, "List name cannot be empty");
    }

    const updatedList = await List.findOneAndUpdate(
        {
            _id: listId,
            userId: user,
        },
        {
            $set: {
                listName: listName,
            }
        },
        {
            new: true,
        }
    );

    if (!updatedList) {
        throw new ApiError(404, "List not found or you don't have permission to update the list");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updatedList,
                "List name updated successfully"
            )
        );

});

const deleteSelectedList = asyncHandler(async (req, res) => {

    const { listId } = req.params;
    const userId = req.user?._id;

    const deletedList = await List.findOneAndDelete(
        {
            _id: listId,
            userId: userId,
        });

    if (!deletedList) {
        throw new ApiError(404, "List not found or you don't have permission to delete this list");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "List deleted successfully"
            )
        );

});

export {
    newList,
    getListById,
    getAllLists,
    updateListName,
    deleteSelectedList,
}
