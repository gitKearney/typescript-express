import { run } from "../db/_connector.js";

export const getLunchItemIdsByName = async (lunchItems: Array<string>) => {
  const lunchItemKeys: string[] = [];
  const lunchItemValues: any = {};
  lunchItems.forEach((lunchItem: string, index: number) => {
    lunchItemKeys.push(`:item${index}`);
    lunchItemValues[`item${index}`] = lunchItem;
  });

  const liPlaceholders = lunchItemKeys.join();

  const sql = `SELECT id, name FROM lunch_items WHERE name IN (${liPlaceholders})`;
  const rsLI: any = await run(sql, lunchItemValues);

  if (Array.isArray(rsLI)) {
    return rsLI;
  }

  return [];
};
