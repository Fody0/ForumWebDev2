import "dotenv/config";
import express, {NextFunction, Request, Response} from "express";
import notesRoutes from "./routes/notes";
import userRoutes from "./routes/users";
import morgan from "morgan"
import createHttpError, {isHttpError} from "http-errors";
import session from "express-session";
import env from "./util/validateEnv";
import MongoStore from "connect-mongo";

const app = express();

app.use(morgan("dev"));

app.use(express.json());

app.use(session({
   secret: env.SESSION_SECRET,
   resave: false,
   saveUninitialized: false,
   cookie: {
      maxAge: 60*60*10000
   },
   rolling: true,
   store: MongoStore.create({
       mongoUrl: env.MONGODB_CONNECTION_STRING
   }),
}));

app.use("/api/users", userRoutes);
app.use("/api/notes", notesRoutes);

app.use((req,res,next) => {
   next(createHttpError(404, "Endpoint not found 1"));
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction ) => {
   console.log(error);
   let errorMessage = "Unknown Error Occured";
   let statusCode = 500;
   if(isHttpError(error)){
      statusCode = error.status;
      errorMessage = error.message;
   }
   res.status(statusCode).json({error: errorMessage});
});

export default app;