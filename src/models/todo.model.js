import mongoose, { Schema } from "mongoose";

const todoSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            default: "",
        },
        listId: {
            type: Schema.Types.ObjectId,
            ref: "List",
            required: true,
            index: true,
        },
        priority: {
            type: String,
            enum: ["HIGH", "MEDIUM", "LOW", ""],
            default: "MEDIUM",
        },
        due_date: {
            type: Date,
            required: true,
        },
        isComplete: {
            type: Boolean,
            default: false,
        }
    },
    {
        timestamps: true,
    }
);

export const Todo = mongoose.model("Todo", todoSchema);