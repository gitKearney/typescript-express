import { run } from "../db/_connector.js";

export const getPersonOrderByDay = async (
  personId: number,
  weekday: string,
) => {
  const sql =
    "SELECT id FROM lunch_orders WHERE people_id = :personId AND weekday = :weekday";
  const rsLO: any = await run(sql, { personId, weekday });
  if (Array.isArray(rsLO)) {
    if (!rsLO.length) {
      throw Error("Invalid weekday chosen");
    }
    return rsLO[0].id;
  }

  return null;
};

export const removePersonsWeekOrders = async (personId: number) => {
  const sql = "DELETE FROM lunch_orders WHERE people_id = :personId";
  await run(sql, { personId });
};
