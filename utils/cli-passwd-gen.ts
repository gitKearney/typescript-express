import { argon2Encrypt } from "./argon2Hash.js";

const main = () => {
  argon2Encrypt("abc246!!").then((value) => console.log(value));
};

main();

// to run this file: npm run build; node utils/cli-passwd-gen.js
