import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

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

userSchema.methods.isPasswordCorrect = async function (pwd) {
    return await bcrypt.compare(pwd, this.password);
}

export const User = mongoose.model("User", userSchema);
