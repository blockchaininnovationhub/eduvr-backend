import crypto from "crypto";

export const sha256 = (message) => {
  return crypto.createHash("sha256").update(message).digest("hex");
};

export const objectHasher = (obj) => {
  const stringifiedObj = JSON.stringify(obj);

  return sha256(stringifiedObj);
};

export const lowercaseObjectProperties = (obj) => {
  if (typeof obj === "string") {
    return obj.toLowerCase();
  } else if (Array.isArray(obj)) {
    return obj.map(lowercaseObjectProperties);
  } else if (typeof obj === "object" && obj !== null) {
    return Object.keys(obj).reduce((result, key) => {
      result[key] = lowercaseObjectProperties(obj[key]);
      return result;
    }, {});
  }
  return obj;
};

export const sortObjectProperties = (obj) => {
  return Object.keys(obj)
    .sort()
    .reduce((result, key) => {
      result[key] =
        typeof obj[key] === "object" && obj[key] !== null
          ? sortObjectProperties(obj[key])
          : obj[key];
      return result;
    }, {});
};

const generateJWT = (payload, key, expiresIn) => {
  return jwt.sign(payload, key, {
    expiresIn,
  });
};

export const generateAccessToken = (payload) => {
  return generateJWT(payload, process.env.SECRET_KEY_ACCESS_TOKEN, "1d");
};

export const generateRefreshAccessToken = (payload) => {
  return generateJWT(payload, process.env.SECRET_KEY_ACCESS_TOKEN, "30d");
};

export const generateRandomString = (length = 128) => {
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-";
  const charsetLength = charset.length;
  let randomString = "";

  for (let i = 0; i < length; i++) {
    let randomIndex = crypto.randomBytes(1)[0] % charsetLength;

    if (i === 0 || i === length - 1) {
      while (charset[randomIndex] === "-") {
        randomIndex = crypto.randomBytes(1)[0] % charsetLength;
      }
    }

    randomString += charset[randomIndex];
  }

  return randomString;
};

export const generateCallURL = () => {
  const randomString = generateRandomString(10);
  const parts = [
    randomString.slice(0, 3),
    randomString.slice(3, 6),
    randomString.slice(6, 10),
  ];

  const result = parts.join("-");
  return result;
};
