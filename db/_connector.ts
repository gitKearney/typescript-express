import { DB_CREDS } from "../configs/creds.js";
import mariadb from "mariadb";

const pool = mariadb.createPool(DB_CREDS);

const batch = async (sql: string, values: Array<any>) => {
  let conn, err;
  try {
    conn = await pool.getConnection();
    await conn.beginTransaction();
    for (let i = 0; i < values.length; i++) {
      await conn.query(
        { namedPlaceholders: true, sql },
        { ...values[i], db: DB_CREDS.database },
      );
    }
  } catch (e: any) {
    err = true;
    console.log("[ERROR] ", e.message);
    if (conn) {
      await conn.rollback();
    }
    throw e;
  } finally {
    if (conn) {
      if (!err) {
        await conn.commit();
      }
      await conn.end();
    }
  }
};

const run = async (sql: string, values: Object) => {
  console.log(`[DEBUG] - _connector.run() ${sql}, ${JSON.stringify(values)}`);
  let conn;
  try {
    conn = await pool.getConnection();
    return await conn.query(
      { namedPlaceholders: true, sql },
      { ...values, db: DB_CREDS.database },
    );
  } catch (e: any) {
    console.log(`[ERROR] - ${e.message}`);
    throw e;
  } finally {
    if (conn) {
      await conn.end();
    }
  }
};

export { pool, batch, run };
