import { Response, Router } from "express";
import { validate } from "../middleware/jwtValidate.js";
import { batch, run } from "../db/_connector.js";
import {
  getPersonOrderByDay,
  removePersonsWeekOrders,
} from "../queries/lunchOrderQueries.js";
import { getLunchItemIdsByName } from "../queries/lunchItemsQueries.js";
import {
  addItemsToUsersLunchDay,
  removeLunchItemsByDayAndUser,
} from "../queries/lunchOrderItemsQueries.js";

export const lunchOrdersRouter = (): Router => {
  const router: Router = Router();

  router.get("/", validate, async (req: any, res: Response) => {
    const { personId } = req.decodedJwt;
    let sql = "SELECT * FROM lunch_orders WHERE people_id = :personId";
    const rs = await run(sql, { personId });
    return res.send(rs);
  });

  router.post("/items", validate, async (req: any, res: Response) => {
    const { personId } = req.decodedJwt;
    if (!Object.prototype.hasOwnProperty.call(req.body, "weekday")) {
      return res
        .status(400)
        .json({ message: "missing post body", success: false });
    }
    const { weekday, lunchItems } = req.body;

    // get the lunch orders
    let lunchOrderId = 0;

    try {
      lunchOrderId = await getPersonOrderByDay(personId, weekday);
    } catch (e: any) {
      return res.status(400).json({ message: e.message });
    }

    // let's delete the lunch items
    try {
      await removeLunchItemsByDayAndUser(lunchOrderId);
    } catch (e: any) {
      console.log(`[ERROR] ${e.message}`);
      return res.status(500).json({ message: "Error setting lunch items" });
    }

    const rsLI: Array<any> = await getLunchItemIdsByName(lunchItems);
    let loiVals: Array<any> = [];
    loiVals = rsLI.map((li: any) => ({
      lunchOrderId,
      lunchItemId: li.id,
    }));

    try {
      await addItemsToUsersLunchDay(loiVals);
    } catch (e: any) {
      console.log(`[ERROR] ${e.message}`);
      return res
        .status(500)
        .json({ message: "Failed to add items to lunch", success: false });
    }

    res.status(200).json({ message: "good", success: true });
  });

  /**
   * this route to add the days the person will eat
   */
  router.post("/", validate, async (req: any, res: Response) => {
    // get the user id
    const { personId } = req.decodedJwt;
    if (!Object.prototype.hasOwnProperty.call(req.body, "weekdays")) {
      return res
        .status(400)
        .json({ message: "missing post body", success: false });
    }

    const { weekdays } = req.body;

    try {
      await removePersonsWeekOrders(personId);
    } catch (e: any) {
      console.log(`[ERROR] ${e.message}`);
      return res.status(500).json({ message: "Error setting weekday orders" });
    }

    try {
      const sql =
        "INSERT INTO lunch_orders (weekday, people_id) VALUES (:day, :personId)";
      const values = weekdays.map((day: string) => ({ day, personId }));
      await batch(sql, values);
    } catch (e: any) {
      console.log(`[ERROR] - lunchOrdersRouter.post / ${e.message}`);
      return res
        .status(500)
        .json({ success: false, message: "Failed setting weekday orders" });
    }

    return res.status(200).json({ success: true });
  });

  return router;
};
