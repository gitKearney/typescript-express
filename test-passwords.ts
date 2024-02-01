import { argon2Verify } from "./utils/argon2Hash.js";

const abc246 =
  "$argon2id$v=19$m=65536,t=3,p=4$9LoiaSNdxe0K+n284os+Tg$MnzMv7MVl7E1zJQ7YCCLd/uYtDn7A+x8LRrisikRLns";
argon2Verify(abc246, "abc246!!").then((res) => console.log(res));
