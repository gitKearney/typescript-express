import express, { Express, NextFunction, Request, Response } from "express";
import cors from "cors";
import session from "express-session";

import path from "node:path";
import { fileURLToPath } from "url";
import { homeRouter } from "./routes/homeRouter.js";
import { userRouter } from "./routes/userRouter.js";
import { authRouter } from "./routes/authRouter.js";
import { lunchItemsRouter } from "./routes/lunchItemsRouter.js";
import { lunchOrdersRouter } from "./routes/lunchOrdersRouter.js";
import { adminRouter } from "./routes/adminRouter.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT: number = 3000;
const app: Express = express();

app.use(express.json({ inflate: true }));
app.use(express.urlencoded({ extended: true }));

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(req.method);
  next();
});

// accept CORS requests and set session info
app.use(cors());
app.set("trust proxy", 1);
app.use(session({ secret: "session passcode", name: "sessionId" }));

app.use(express.static(path.join(__dirname, "public")));
app.use("/home", homeRouter());
app.use("/user", userRouter());
app.use("/auth", authRouter());
app.use("/lunchitems", lunchItemsRouter());
app.use("/lunch-orders", lunchOrdersRouter());
app.use("/admin", adminRouter());
app.listen(PORT, () => console.log(`server started http://localhost:${PORT}`));
