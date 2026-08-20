import User from "../models/user.model.js";
import UserSchema from "../validators/auth.validator.js";
import { hashPassword, verifyPassword } from "../utils/password.js";

export const registerUser = async (data) => {
  const validatedData = UserSchema.parse(data);

  const existingUser = await User.findOne({
    $or: [
      { email: validatedData.email },
      { phone: validatedData.phone },
    ],
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await hashPassword(validatedData.password);

  const user = await User.create({
    name: validatedData.name,
    email: validatedData.email,
    phone: validatedData.phone,
    password: hashedPassword,
  });

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
  };
};

export const loginUser = async (data) => {
  const validatedData = UserSchema.pick({
    email: true,
    password: true,
  }).parse(data);

  const user = await User.findOne({
    email: validatedData.email,
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isPasswordValid = await verifyPassword(
    user.password,
    validatedData.password
  );

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
  };
};