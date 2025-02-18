import app from "./app"
import env from "../src/util/validateEnv";
import mongoose from "mongoose";

const port = env.PORT;


mongoose.connect(env.MONGODB_CONNECTION_STRING).then(() => {
    console.log("MongoDB Connected!");
    app.listen(port, () => {
        console.log(`Server started on port ${port}`);
    })
}).catch(err => console.log(err));
