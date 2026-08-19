import { sessionRepository } from "../repositories/session.repository.js";
import { tokenService } from "./token.service.js";

const createSession = async ({
  userId,
  deviceId,
  userAgent,
  ipAddress,
  device,
  browser,
  operatingSystem,
  country,
  city,
  timezone,
  expiresAt,
}) => {
  return sessionRepository.create({
    userId,
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
    expiresAt,
    isActive: true,
  });
};

const getSession = async (sessionId) => {
  return sessionRepository.findById(
    sessionId
  );
};

const getUserSessions = async (
  userId,
  activeOnly = true
) => {
  return sessionRepository.findByUserId(
    userId,
    {
      activeOnly,
      lean: true,
    }
  );
};

const updateActivity = async (
  sessionId,
  ipAddress
) => {
  return sessionRepository.updateLastUsed(
    sessionId,
    ipAddress
  );
};

const revokeSession = async (
  sessionId,
  reason = "logout"
) => {
  await tokenService.revokeSessionTokens(
    sessionId
  );

  return sessionRepository.revokeById(
    sessionId,
    reason
  );
};

const revokeAllSessions = async (
  userId,
  reason = "logout_all_devices"
) => {
  await tokenService.revokeUserTokens(
    userId
  );

  return sessionRepository.revokeAllByUserId(
    userId,
    reason
  );
};

const revokeOtherSessions = async (
  userId,
  currentSessionId
) => {
  const sessions =
    await sessionRepository.findByUserId(
      userId,
      {
        activeOnly: true,
        lean: true,
      }
    );

  const otherSessions = sessions.filter(
    (session) =>
      session._id.toString() !==
      currentSessionId.toString()
  );

  await Promise.all(
    otherSessions.map((session) =>
      tokenService.revokeSessionTokens(
        session._id
      )
    )
  );

  return sessionRepository.revokeOtherSessions(
    userId,
    currentSessionId
  );
};

export const sessionService = {
  createSession,
  getSession,
  getUserSessions,
  updateActivity,
  revokeSession,
  revokeAllSessions,
  revokeOtherSessions,
};