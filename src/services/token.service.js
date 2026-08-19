import { tokenRepository } from "../repositories/token.repository.js";
import { cryptoUtils } from "../utils/crypto.js";
import { jwtUtils } from "../utils/jwt.js";
import { AUTH_CONSTANTS } from "../constants/auth.constants.js";

const createTokenPair = async ({
  userId,
  sessionId,
}) => {
  const accessToken = jwtUtils.signAccessToken({
    sub: userId.toString(),
    sessionId: sessionId.toString(),
    type: AUTH_CONSTANTS.ACCESS_TOKEN_TYPE,
  });

  const refreshToken = jwtUtils.signRefreshToken({
    sub: userId.toString(),
    sessionId: sessionId.toString(),
    type: AUTH_CONSTANTS.REFRESH_TOKEN_TYPE,
  });

  const refreshTokenHash =
    cryptoUtils.hash(refreshToken);

  const decodedRefreshToken =
    jwtUtils.verifyRefreshToken(refreshToken);

  await tokenRepository.create({
    userId,
    sessionId,
    tokenHash: refreshTokenHash,
    type: AUTH_CONSTANTS.REFRESH_TOKEN_TYPE,
    expiresAt: new Date(
      decodedRefreshToken.exp * 1000
    ),
  });

  return {
    accessToken,
    refreshToken,
  };
};

const verifyAccessToken = (token) => {
  return jwtUtils.verifyAccessToken(token);
};

const verifyRefreshToken = (token) => {
  return jwtUtils.verifyRefreshToken(token);
};

const findRefreshToken = async (refreshToken) => {
  const tokenHash =
    cryptoUtils.hash(refreshToken);

  return tokenRepository.findActiveRefreshToken(
    tokenHash
  );
};

const revokeToken = async (refreshToken) => {
  const tokenHash =
    cryptoUtils.hash(refreshToken);

  return tokenRepository.revokeByHash(
    tokenHash
  );
};

const revokeSessionTokens = async (sessionId) => {
  return tokenRepository.revokeBySessionId(
    sessionId
  );
};

const revokeUserTokens = async (userId) => {
  return tokenRepository.revokeByUserId(
    userId
  );
};

export const tokenService = {
  createTokenPair,
  verifyAccessToken,
  verifyRefreshToken,
  findRefreshToken,
  revokeToken,
  revokeSessionTokens,
  revokeUserTokens,
};