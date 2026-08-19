// src/services/auth.service.js

import { userRepository } from "../repositories/user.repository.js";
import { sessionRepository } from "../repositories/session.repository.js";
import { tokenService } from "./token.service.js";
import { passwordService } from "./password.service.js";

const register = async ({
  username,
  email,
  password,
}) => {
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedUsername = username.trim();

  const existingUser =
    await userRepository.findByEmailOrUsername(
      normalizedEmail,
      normalizedUsername
    );

  if (existingUser) {
    const error = new Error("User already exists");
    error.statusCode = 409;
    error.code = "USER_ALREADY_EXISTS";
    throw error;
  }

  const passwordHash =
    await passwordService.hashPassword(password);

  const user = await userRepository.create({
    username: normalizedUsername,
    email: normalizedEmail,
    password: passwordHash,
  });

  return user;
};

const login = async ({
  email,
  password,
  deviceId,
  userAgent,
  ipAddress,
  device,
  browser,
  operatingSystem,
  country,
  city,
  timezone,
}) => {
  const normalizedEmail = email.trim().toLowerCase();

  const user = await userRepository.findByEmail(
    normalizedEmail,
    {
      select: "+password",
    }
  );

  if (!user) {
    const error = new Error("Invalid credentials");
    error.statusCode = 401;
    error.code = "INVALID_CREDENTIALS";
    throw error;
  }

  if (user.lockedUntil && user.lockedUntil > new Date()) {
    const error = new Error("Account temporarily locked");
    error.statusCode = 423;
    error.code = "ACCOUNT_LOCKED";
    throw error;
  }

  const passwordValid =
    await passwordService.verifyPassword(
      user.password,
      password
    );

  if (!passwordValid) {
    const error = new Error("Invalid credentials");
    error.statusCode = 401;
    error.code = "INVALID_CREDENTIALS";
    throw error;
  }

  const session =
    await sessionRepository.create({
      userId: user._id,
      deviceId,
      userAgent,
      ipAddress,
      lastIpAddress: ipAddress,
      device,
      browser,
      operatingSystem,
      country,
      city,
      timezone,
      loginAt: new Date(),
      lastUsedAt: new Date(),
      expiresAt: new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
      ),
      isActive: true,
    });

  const tokens = await tokenService.createTokenPair({
    userId: user._id,
    sessionId: session._id,
  });

  return {
    user,
    session,
    ...tokens,
  };
};

const logout = async (sessionId) => {
  await tokenService.revokeSessionTokens(sessionId);

  return sessionRepository.revokeById(
    sessionId,
    "logout"
  );
};

const logoutAllDevices = async (userId) => {
  await tokenService.revokeUserTokens(userId);

  return sessionRepository.revokeAllByUserId(
    userId,
    "logout_all_devices"
  );
};

export const authService = {
  register,
  login,
  logout,
  logoutAllDevices,
};