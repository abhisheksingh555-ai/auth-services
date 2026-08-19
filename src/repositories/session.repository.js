import Session from "../models/session.model.js";

const create = async (data) => {
  return Session.create(data);
};

const findById = async (sessionId, options = {}) => {
  const query = Session.findById(sessionId);

  if (options.select) {
    query.select(options.select);
  }

  if (options.populateUser) {
    query.populate("userId");
  }

  if (options.lean) {
    query.lean();
  }

  return query.exec();
};

const findByUserId = async (userId, options = {}) => {
  const query = Session.find({
    userId,
  });

  if (options.activeOnly) {
    query.where({
      revokedAt: null,
      isActive: true,
      expiresAt: { $gt: new Date() },
    });
  }

  query.sort({ lastUsedAt: -1 });

  if (options.lean) {
    query.lean();
  }

  return query.exec();
};

const findByUserAndDevice = async (userId, deviceId) => {
  return Session.findOne({
    userId,
    deviceId,
    revokedAt: null,
    isActive: true,
    expiresAt: { $gt: new Date() },
  }).exec();
};

const updateLastUsed = async (sessionId, ipAddress = null) => {
  const update = {
    lastUsedAt: new Date(),
  };

  if (ipAddress) {
    update.lastIpAddress = ipAddress;
  }

  return Session.findByIdAndUpdate(
    sessionId,
    update,
    {
      new: true,
      runValidators: true,
    }
  ).exec();
};

const revokeById = async (sessionId, reason = "logout") => {
  return Session.findOneAndUpdate(
    {
      _id: sessionId,
      revokedAt: null,
    },
    {
      revokedAt: new Date(),
      revokeReason: reason,
      isActive: false,
    },
    {
      new: true,
      runValidators: true,
    }
  ).exec();
};

const revokeAllByUserId = async (
  userId,
  reason = "logout_all_devices"
) => {
  return Session.updateMany(
    {
      userId,
      revokedAt: null,
      isActive: true,
    },
    {
      $set: {
        revokedAt: new Date(),
        revokeReason: reason,
        isActive: false,
      },
    }
  ).exec();
};

const revokeOtherSessions = async (
  userId,
  currentSessionId,
  reason = "logout_other_devices"
) => {
  return Session.updateMany(
    {
      userId,
      _id: { $ne: currentSessionId },
      revokedAt: null,
      isActive: true,
    },
    {
      $set: {
        revokedAt: new Date(),
        revokeReason: reason,
        isActive: false,
      },
    }
  ).exec();
};

const deleteExpiredSessions = async () => {
  return Session.deleteMany({
    expiresAt: {
      $lte: new Date(),
    },
  }).exec();
};

export const sessionRepository = {
  create,
  findById,
  findByUserId,
  findByUserAndDevice,
  updateLastUsed,
  revokeById,
  revokeAllByUserId,
  revokeOtherSessions,
  deleteExpiredSessions,
};