import jsonwebtoken from "jsonwebtoken";
import { NextFunction, Response } from "express";
import { JWT_SECRET } from "../configs/creds.js";
import { getUserById } from "../queries/userQueries.js";
import { argon2Verify } from "../utils/argon2Hash.js";

const { verify } = jsonwebtoken;

type DecodedJwtInfo = {
  userId: number;
  passwd: string;
};

const validateJwt = (token: string): Promise<DecodedJwtInfo> => {
  return new Promise((resolve, reject) => {
    const decoder = (err: any, decoded: any) => {
      if (err) {
        console.log(`[ERROR] ${err.message}`);
        return reject("invalid token");
      }

      const { id: userId, passwd } = decoded.data;
      resolve({ userId, passwd });
    };

    verify(token, JWT_SECRET, decoder);
  });
};

const validatePassword = async (password: string, userId: number) => {
  const rs = await getUserById(userId);
  if (Object.keys(rs).length === 0) {
    return false;
  }

  return await argon2Verify(rs.upassword, password);
};

export const validate = async (req: any, res: Response, next: NextFunction) => {
  const auth = req.get("authorization");
  if (!auth) {
    return res.status(401).send("invalid token (missing)");
  }

  const parts = auth.split("Bearer");
  if (parts.length !== 2) {
    return res.status(401).send("malformed headers");
  }

  const token = parts[1].trim();

  try {
    req.decodedJwt = await validateJwt(token);
  } catch (e: any) {
    console.log(`[ERROR] ${e.message}`);
    res.status(401).json({ message: "bad token" });
  }

  const userRs = await getUserById(req.decodedJwt.userId);

  req.decodedJwt.personId = userRs.person_id;
  console.log("req.decodedJwt", req.decodedJwt);
  const match = await validatePassword(
    req.decodedJwt.passwd,
    req.decodedJwt.userId,
  );
  if (!match) {
    res.status(401).json({ message: "invalid password" });
    return;
  }

  next();
};
