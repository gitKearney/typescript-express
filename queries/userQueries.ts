import { run } from "../db/_connector.js";

export const getUserById = async (userId: number) => {
  const sql = "SELECT upassword, person_id FROM users WHERE user_id = :userId";
  const rs = await run(sql, { userId });
  if (Array.isArray(rs) && rs.length > 0) {
    return rs[0];
  }

  return {};
};

export const getUserByEmail = async (
  email: string,
  expectedZero: boolean = false,
) => {
  const sql = `SELECT upassword, user_id FROM users WHERE email = :email`;

  const rs = await run(sql, { email });
  if (Array.isArray(rs)) {
    if (rs.length >= 1) {
      if (expectedZero) {
        throw Error("RECORD_EXISTS");
      }

      return rs[0];
    }

    return {};
  }

  throw new Error("Invalid User");
};

type UserType = {
  upassword: string;
  email: string;
};

export const createUser = (values: UserType) => {
  const sql = "INSERT INTO users (upassword, email) VALUES (:passwd, :email)";
  return run(sql, values);
};
