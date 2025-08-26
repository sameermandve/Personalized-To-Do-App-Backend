import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import { List } from "../models/list.model.js";
import { Todo } from "../models/todo.model.js";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            minLength: 6,
        },
        avatar: {
            url: {
                type: String,
                default: "",
            },
            public_id: {
                type: String,
                default: "",
            }
        }
    },
    {
        timestamps: true
    },
);

userSchema.pre("save", async function (next) {

    if (!this.isModified("password")) return next;

    this.password = await bcrypt.hash(this.password, 10);
    next();

});

/**
 * This is Mongoose middleware that runs automatically BEFORE a user is deleted.
 * Its purpose is to perform a "cascading delete," which means it cleans up all the
 * data associated with the user (their lists and their todos) to prevent orphaned
 * data from being left in the database.
 */

userSchema.pre("findOneAndDelete", { document: false, query: true }, async function (next) {

    // STEP 1: Find the full user document that is about to be deleted.
    // 'this.getFilter()' gets the query conditions (e.g., { _id: "some_user_id" })
    // from the original findByIdAndDelete() call.
    const user = await this.model.findOne(this.getFilter());

    // Safety check: If for some reason the user doesn't exist, stop here.
    if (!user) return next();

    // --- DATA CLEANUP PROCESS ---

    // STEP 2: Find all the 'List' documents that belong to this user.
    const lists = await List.find({ userId: user._id });

    // STEP 3: From those lists, create a simple array of just their IDs.
    // We need this array for the next step.
    // Example: ['listId1', 'listId2', 'listId3']
    const listIds = lists.map(list => list._id);

    // STEP 4: If the user had any lists, delete all 'Todo' documents
    // that belong to ANY of those lists.
    if (listIds.length > 0) {

        // The '$in' operator is very efficient. It tells MongoDB:
        // "Delete every todo where its 'listId' is IN this array of IDs."
        await Todo.deleteMany({ listId: { $in: listIds } });
    }

    // STEP 5: Now that the todos are gone, delete all the 'List' documents
    // that belong to the user.
    await List.deleteMany({ userId: user._id });

    // STEP 6: Call 'next()' to proceed with the original operation,
    // which is to finally delete the user document itself.
    // If you forget this, the user will never be deleted.
    next();

});

userSchema.methods.isPasswordCorrect = async function (pwd) {
    return await bcrypt.compare(pwd, this.password);
}

export const User = mongoose.model("User", userSchema);
