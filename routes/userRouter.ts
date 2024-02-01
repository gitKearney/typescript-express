import { Request, Response, Router } from "express";
import { run } from "../db/_connector.js";
import { argon2Encrypt } from "../utils/argon2Hash.js";
import { getUserByEmail } from "../queries/userQueries.js";
import { validate } from "../middleware/jwtValidate.js";

export const userRouter = () => {
  const router: Router = Router();

  router.post("/person", validate, async (req: any, res: Response) => {
    let sql =
      "INSERT INTO people (first_name, last_name) VALUES (:first_name, :last_name)";

    if (
      !Object.prototype.hasOwnProperty.call(req.body, "first") ||
      !Object.prototype.hasOwnProperty.call(req.body, "last")
    ) {
      return res.status(400).send({ success: false, msg: "invalid input" });
    }

    let personId = 0;
    try {
      const rs = await run(sql, {
        first_name: req.body.first,
        last_name: req.body.last,
      });
      console.log("new ID", rs.insertId.toString());
      personId = rs.insertId;
    } catch (err: any) {
      console.log("ERROR] ", err.code, err.message);
      res.status(500).send({ message: err.message });
    }

    // now update the user table with the person ID
    try {
      sql = "UPDATE users SET person_id = :personId WHERE user_id = :userId";
      const rs = await run(sql, {
        personId,
        userId: req.decodedJwt.userId,
      });
    } catch (e: any) {
      res.status(500).json({ message: e.message });
    }

    return res.status(200).json({ msg: "success" });
  });

  router.post("/register", async (req: Request, res: Response) => {
    let sql = "";

    if (
      !Object.prototype.hasOwnProperty.call(req.body, "email") ||
      !Object.prototype.hasOwnProperty.call(req.body, "passwd")
    ) {
      return res.status(400).send({ success: false, msg: "invalid input" });
    }

    // 1st create the user, then we create the person record
    const upassword = await argon2Encrypt(req.body.passwd);

    sql = "INSERT INTO users (email, upassword) VALUES (:email, :passwd)";
    try {
      await run(sql, {
        email: req.body.email,
        passwd: upassword,
      });
      return res.status(200).send({ success: true });
    } catch (e: any) {
      console.log(`[ERROR] ${e.message}`);
      let message = "Failed to create new user account";
      if (e.message === "ER_DUP_ENTRY") {
        message = "account already exists";
      }
      return res.status(500).json({ message });
    }
  });

  router.get("/:id", async (req: Request, res: Response) => {
    return res.status(418).send({ msg: "looking around" });
  });

  return router;
};
