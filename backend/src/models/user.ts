import mongoose, {InferSchemaType, model} from "mongoose";

const userSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true },
    email: {type: String, required: true, unique: true, select: false},
    password: {type: String, required: true, select: false},
})

type User = InferSchemaType<typeof userSchema>;

export default model<User>("User", userSchema);