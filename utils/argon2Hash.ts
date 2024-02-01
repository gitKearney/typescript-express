import { hash, verify } from "argon2";

export const argon2Encrypt = async (password: string) => {
  return await hash(password);
};

export const argon2Verify = async (hashValue: string, password: string) => {
  const match = await verify(hashValue, password);
  if (match) {
    return true;
  }
  console.log("the passwords did NOT match");
  return false;
};
