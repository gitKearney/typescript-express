import jsonwebtoken from "jsonwebtoken";
import { Request, Response, Router } from "express";
import { JWT_SECRET } from "../configs/creds.js";
import { argon2Verify } from "../utils/argon2Hash.js";
import { getUserByEmail } from "../queries/userQueries.js";

const { sign } = jsonwebtoken;

interface JwtUserInfo {
  id: string;
  passwd: string;
}

const encode = async (userInfo: JwtUserInfo): Promise<string> => {
  let currentTime = Math.floor(Date.now() / 1000);

  const minutesGoodFor = 95;
  const JWT = {
    aud: "example.com", // audience: JWT's audience
    data: userInfo, // data is our user's info
    exp: currentTime + 60 * minutesGoodFor, // expiresIn is how many seconds till this token expires
    iat: currentTime, // issued at time: the time the token is issued at
    iss: "example.com", // the issuer of this token
    nbf: currentTime, // not before: the token is not good for anytime before this timestamp
  };

  return sign(JWT, JWT_SECRET);
};

export const authRouter = () => {
  const router: Router = Router();

  router.post("/", async (req: Request, res: Response) => {
    if (
      !Object.prototype.hasOwnProperty.call(req.body, "email") ||
      !Object.prototype.hasOwnProperty.call(req.body, "passwd")
    ) {
      res.status(400).send("Invalid user credentials");
      return;
    }

    const { email, passwd } = req.body;

    // query from DB password
    let user;
    try {
      user = await getUserByEmail(email);
    } catch (e: any) {
      return res.status(401).send("invalid username");
    }

    console.log(`[DEBUG] upassword ${user.upassword}`);
    console.log(`[DEBUG] passwd: ${passwd}`);
    const match = await argon2Verify(user.upassword, passwd);
    if (!match) {
      return res.status(401).send("invalid username password combo");
    }
    let token = await encode({ id: user.user_id, passwd });
    res.status(200).json({ token });
  });

  return router;
};
