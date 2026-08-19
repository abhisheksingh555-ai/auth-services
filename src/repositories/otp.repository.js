import Otp from "../models/otp.model.js";

const create = async (data) => {
  return Otp.create(data);
};

const findById = async (otpId, options = {}) => {
  const query = Otp.findById(otpId);

  if (options.includeHash) {
    query.select("+otpHash");
  }

  if (options.lean) {
    query.lean();
  }

  return query.exec();
};

const findActive = async (userId, purpose, options = {}) => {
  const query = Otp.findOne({
    userId,
    purpose,
    consumedAt: null,
    expiresAt: {
      $gt: new Date(),
    },
  }).sort({
    createdAt: -1,
  });

  if (options.includeHash) {
    query.select("+otpHash");
  }

  if (options.lean) {
    query.lean();
  }

  return query.exec();
};

const incrementAttempts = async (otpId) => {
  return Otp.findOneAndUpdate(
    {
      _id: otpId,
      consumedAt: null,
    },
    {
      $inc: {
        attempts: 1,
      },
    },
    {
      new: true,
    }
  ).exec();
};

const consume = async (otpId) => {
  return Otp.findOneAndUpdate(
    {
      _id: otpId,
      consumedAt: null,
    },
    {
      $set: {
        consumedAt: new Date(),
      },
    },
    {
      new: true,
    }
  ).exec();
};

const invalidateActive = async (userId, purpose) => {
  return Otp.updateMany(
    {
      userId,
      purpose,
      consumedAt: null,
      expiresAt: {
        $gt: new Date(),
      },
    },
    {
      $set: {
        consumedAt: new Date(),
      },
    }
  ).exec();
};

const deleteExpired = async () => {
  return Otp.deleteMany({
    expiresAt: {
      $lte: new Date(),
    },
  }).exec();
};

export const otpRepository = {
  create,
  findById,
  findActive,
  incrementAttempts,
  consume,
  invalidateActive,
  deleteExpired,
};