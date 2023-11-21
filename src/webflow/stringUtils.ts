export const extractNumbers = (str) => {
  const regex = /\d+/g;
  const matches = str.match(regex);
  return matches ? matches.map(Number) : [];
};

export const generateRandomString = (length: number): string => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
};

export const extractSubstring = (inputString) => {
  const matchResult = inputString.match(/&customFormly!(.*?)&customFormly&/);

  if (matchResult && matchResult.length >= 2) {
    return matchResult[1];
  } else {
    return null; // or any other value indicating that the substring was not found
  }
};

export const alternateDirections = (length) => {
  const result = [];

  for (let i = 0; i < length; i++) {
    result.push(i % 2 === 0 ? "west" : "east");
  }

  return result;
};
