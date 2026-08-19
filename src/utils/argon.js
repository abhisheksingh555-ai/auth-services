import argon2 from "argon2";

const hash = async (value) => {
  if (!value || typeof value !== "string") {
    throw new TypeError("Value must be a non-empty string");
  }

  return argon2.hash(value, {
    type: argon2.argon2id,
  });
};

const verify = async (hashValue, plainValue) => {
  if (!hashValue || !plainValue) {
    return false;
  }

  try {
    return await argon2.verify(hashValue, plainValue);
  } catch {
    return false;
  }
};

export const argon = {
  hash,
  verify,
};