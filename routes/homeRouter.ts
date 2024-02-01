import { Request, Response, Router } from "express";
import path from "node:path";
import { fileURLToPath } from "url";
import { run } from "../db/_connector.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const homeRouter = () => {
  const router: Router = Router();

  router.patch("/", async (req: Request, res: Response) => {
    res.redirect("/");
  });

  router.get("/test", async (req: Request, res: Response) => {
    const sql = "SELECT first_name, last_name FROM people";
    const rs = await run(sql, {});
    res.send(rs);
    return;
  });

  router.get("/", async (req: Request, res: Response) => {
    res.set("Content-Type", "text/html");
    res.sendFile(path.join(__dirname, "../public/home.html"));
  });

  router.post("/", async (req: Request, res: Response) => {
    if (!req.body) {
      res.set("Content-Type", "text/html");
      res.sendFile(path.join(__dirname, "../public/404.html"));
      return;
    }

    return res.send({ success: true, code: 200, message: "Thank you!" });
  });

  return router;
};
