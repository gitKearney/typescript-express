import { run } from "../db/_connector.js";

type PersonInfoType = {
  first: string;
  last: string;
};

export const createPerson = (data: PersonInfoType) => {
  const sql =
    "INSERT INTO people (first_name, last_name) VALUES (:first, :last)";
  try {
    const rs = run(sql, data);
  } catch (e: any) {
    console.log(e.code, e.message);
    throw new Error("Error creating person");
  }
};
