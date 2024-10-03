import mongoose, {model, InferSchemaType, Schema} from "mongoose";

const noteSchema = new Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, required: true},
    title: { type: String, required: true },
    text: { type:String},
    // blogs:[
    //     {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: "Users"
    //     }
    // ]

}, {timestamps: true});

type Note = InferSchemaType<typeof noteSchema>;

export default model<Note>("Note", noteSchema);