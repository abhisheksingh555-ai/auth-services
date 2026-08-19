import crypto from "node:crypto";

const randomBytes = (size = 32) => {
  return crypto.randomBytes(size);
};

const randomHex = (size = 32) => {
  return crypto.randomBytes(size).toString("hex");
};

const randomToken = (size = 32) => {
  return crypto.randomBytes(size).toString("base64url");
};

const hash = (value) => {
  return crypto
    .createHash("sha256")
    .update(value)
    .digest("hex");
};

const generateOtp = (length = 6) => {
  if (!Number.isInteger(length) || length < 4 || length > 10) {
    throw new RangeError("OTP length must be between 4 and 10");
  }

  const min = 10 ** (length - 1);
  const max = 10 ** length;

  return crypto
    .randomInt(min, max)
    .toString();
};

const timingSafeEqual = (valueA, valueB) => {
  const bufferA = Buffer.from(valueA);
  const bufferB = Buffer.from(valueB);

  if (bufferA.length !== bufferB.length) {
    return false;
  }

  return crypto.timingSafeEqual(bufferA, bufferB);
};

export const cryptoUtils = {
  randomBytes,
  randomHex,
  randomToken,
  hash,
  generateOtp,
  timingSafeEqual,
};