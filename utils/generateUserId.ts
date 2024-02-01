/**
 this is an n-tuple permutation (repetition allowed, order matters, must choose 1 from x)

 n^r
 - n - number of items
 - r - how many times you have to choose

 308,915,776 (if only 6 and a-z allowed) 26^6
 2,176,782,336 (if only 6 and [a-z][0-9] allowed) 26^6
 56,800,235,584 (if only 6 and [a-z][A-Z][0-9] allowed) 62^6
 */
export const generateUserId = (): string => {
  let chars: string = "";
  const CHARS: string =
    "abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  for (let i = 5; i >= 0; i--) {
    chars += CHARS[Math.floor(Math.random() * 62)];
  }

  return chars;
};
