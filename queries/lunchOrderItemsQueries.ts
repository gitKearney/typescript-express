import { batch, run } from "../db/_connector.js";
type LunchOrderItemType = {
  lunchOrderId: number;
  lunchItemId: number;
};
export const addItemsToUsersLunchDay = async (
  loiVals: Array<LunchOrderItemType>,
) => {
  const sql =
    "INSERT INTO lunch_order_items (lunch_order_id, lunch_item_id) VALUES (:lunchOrderId, :lunchItemId)";
  const rsLOI: any = await batch(sql, loiVals);
};

export const removeLunchItemsByDayAndUser = async (lunchOrderId: number) => {
  const sql =
    "DELETE FROM lunch_order_items WHERE lunch_order_id = :lunchOrderId";
  await run(sql, { lunchOrderId });
};
