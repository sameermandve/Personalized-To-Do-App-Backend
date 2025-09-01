import mongoose, { Schema } from "mongoose";

const listSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        listName: {
            type: String,
            required: true,
            index: true,
        },
        listDesc: {
            type: String,
            required: true,
        },
        todos: {
            type: [
                {
                    type: Schema.Types.ObjectId,
                    ref: "Todo",
                }
            ],
            default: [],
        }
    },
    {
        timestamps: true,
    }
);

export const List = mongoose.model("List", listSchema);