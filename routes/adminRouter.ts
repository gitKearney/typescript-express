import { Request, Response, Router } from "express";
import { validate } from "../middleware/jwtValidate.js";
import { batch, run } from "../db/_connector.js";

export const adminRouter = () => {
  const router: Router = Router();

  /**
   * Gets all user's lunch orders for the week unless query param of userID
   */
  router.get("/user-lunch-order", async (req: any, res: Response) => {
    const sql = `SELECT p.id, p.last_name, p.first_name, lo.weekday, li.name
FROM people p
INNER JOIN lunch_orders lo ON p.id = lo.people_id
LEFT OUTER JOIN lunch_order_items loi ON lo.id = loi.lunch_order_id
INNER JOIN lunch_items li ON loi.lunch_item_id = li.id
ORDER BY lo.weekday, p.last_name    
    `;

    const rs = await run(sql, {});

    // format results
    const results: any = {};
    rs.forEach((record: any) => {
      if (!Object.prototype.hasOwnProperty.call(results, record.id)) {
        const { last_name, first_name } = record;
        results[record.id] = { last_name, first_name };
      }

      if (
        !Object.prototype.hasOwnProperty.call(
          results[record.id],
          record.weekday,
        )
      ) {
        results[record.id][record.weekday] = [];
      }

      results[record.id][record.weekday].push(record.name);
    });

    return res.status(200).json({ results });
  });

  router.get("/items-ordered-by-day", async (req: any, res: Response) => {
    const weekday = req.query.weekday;

    const sql = `SELECT li.id, li.name, COUNT(tuesday_items.lunch_item_id) as amt
FROM lunch_items li
LEFT OUTER JOIN (
    SELECT loi.lunch_item_id
    FROM lunch_order_items loi
             INNER JOIN lunch_orders lo ON loi.lunch_order_id = lo.id
    WHERE lo.weekday = '${weekday}'
) AS tuesday_items ON li.id = tuesday_items.lunch_item_id
GROUP BY li.name, li.id
ORDER BY li.id;
`;
    const rs = await run(sql, {});
    const results = JSON.parse(
      JSON.stringify(rs, (_, v) => (typeof v === "bigint" ? v.toString() : v)),
    );
    return res.status(200).json({ results });
  });

  return router;
};
