import { Request, Response, Router } from "express";
import { validate } from "../middleware/jwtValidate.js";
import { run } from "../db/_connector.js";

export const lunchItemsRouter = (): Router => {
  const router: Router = Router();

  router.get("/", validate, async (req: Request, res: Response) => {
    const sql = "SELECT * FROM lunch_items";
    const rs = await run(sql, {});
    return res.send(rs);
  });

  return router;
};
