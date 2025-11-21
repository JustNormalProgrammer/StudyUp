import express, {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from "express";
import "dotenv/config";
import helmet from "helmet";
import auth from "./routes/auth";
import cors from "cors";
import cookieParser from "cookie-parser";
import { allowedOrigins } from "./config/allowedOrigins";
import { credentials } from "./middleware/credentials";
import sessions from "./routes/sessions";
import tags from "./routes/tags";
import quizzes from "./routes/quizes";
import user from "./routes/user";

const app = express();

app.use(credentials);

const port = process.env.PORT || 3000;
app.use(cors({ origin: allowedOrigins }));
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

app.use("/", user);
app.use("/auth", auth);
app.use("/sessions", sessions);
app.use("/tags", tags);
app.use("/quizzes", quizzes);

app.use(
  (
    err: ErrorRequestHandler,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    console.log(err);
    res.sendStatus(500);
  }
);

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
