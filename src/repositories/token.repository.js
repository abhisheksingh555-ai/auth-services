import Token from "../models/token.model.js";
import { AUTH_CONSTANTS } from "../constants/auth.constants.js";

const create = async (data) => {
  return Token.create(data);
};

const findById = async (tokenId, options = {}) => {
  const query = Token.findById(tokenId);

  if (options.lean) {
    query.lean();
  }

  return query.exec();
};

const findByHash = async (tokenHash) => {
  return Token.findOne({
    tokenHash,
  }).exec();
};

const findActiveByHash = async (tokenHash) => {
  return Token.findOne({
    tokenHash,
    revokedAt: null,
    expiresAt: {
      $gt: new Date(),
    },
  }).exec();
};

const findActiveRefreshToken = async (tokenHash) => {
  return Token.findOne({
    tokenHash,
    type: AUTH_CONSTANTS.REFRESH_TOKEN_TYPE,
    revokedAt: null,
    expiresAt: {
      $gt: new Date(),
    },
  }).exec();
};

const revokeById = async (tokenId) => {
  return Token.findOneAndUpdate(
    {
      _id: tokenId,
      revokedAt: null,
    },
    {
      $set: {
        revokedAt: new Date(),
      },
    },
    {
      new: true,
    }
  ).exec();
};

const revokeByHash = async (tokenHash) => {
  return Token.findOneAndUpdate(
    {
      tokenHash,
      revokedAt: null,
    },
    {
      $set: {
        revokedAt: new Date(),
      },
    },
    {
      new: true,
    }
  ).exec();
};

const revokeBySessionId = async (sessionId) => {
  return Token.updateMany(
    {
      sessionId,
      revokedAt: null,
    },
    {
      $set: {
        revokedAt: new Date(),
      },
    }
  ).exec();
};

const revokeByUserId = async (userId) => {
  return Token.updateMany(
    {
      userId,
      revokedAt: null,
    },
    {
      $set: {
        revokedAt: new Date(),
      },
    }
  ).exec();
};

const replaceToken = async (oldTokenId, newTokenId) => {
  return Token.findOneAndUpdate(
    {
      _id: oldTokenId,
      revokedAt: null,
    },
    {
      $set: {
        revokedAt: new Date(),
        replacedByTokenId: newTokenId,
      },
    },
    {
      new: true,
    }
  ).exec();
};

const deleteExpired = async () => {
  return Token.deleteMany({
    expiresAt: {
      $lte: new Date(),
    },
  }).exec();
};

export const tokenRepository = {
  create,
  findById,
  findByHash,
  findActiveByHash,
  findActiveRefreshToken,
  revokeById,
  revokeByHash,
  revokeBySessionId,
  revokeByUserId,
  replaceToken,
  deleteExpired,
};