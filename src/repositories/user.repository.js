import User from "../models/user.model.js";

const create = async (data) => {
  return User.create(data);
};

const findById = async (userId, options = {}) => {
  const query = User.findById(userId);

  if (options.select) {
    query.select(options.select);
  }

  if (options.lean) {
    query.lean();
  }

  return query.exec();
};

const findByEmail = async (email, options = {}) => {
  const query = User.findOne({
    email: email.toLowerCase().trim(),
  });

  if (options.select) {
    query.select(options.select);
  }

  if (options.lean) {
    query.lean();
  }

  return query.exec();
};

const findByUsername = async (username, options = {}) => {
  const query = User.findOne({
    username: username.trim(),
  });

  if (options.select) {
    query.select(options.select);
  }

  if (options.lean) {
    query.lean();
  }

  return query.exec();
};

const findByEmailOrUsername = async (email, username) => {
  return User.findOne({
    $or: [
      { email: email.toLowerCase().trim() },
      { username: username.trim() },
    ],
  }).exec();
};

const updateById = async (userId, update, options = {}) => {
  return User.findByIdAndUpdate(
    userId,
    update,
    {
      new: true,
      runValidators: true,
      ...options,
    }
  ).exec();
};

const deleteById = async (userId) => {
  return User.findByIdAndDelete(userId).exec();
};

const existsByEmail = async (email) => {
  return User.exists({
    email: email.toLowerCase().trim(),
  });
};

const existsByUsername = async (username) => {
  return User.exists({
    username: username.trim(),
  });
};

export const userRepository = {
  create,
  findById,
  findByEmail,
  findByUsername,
  findByEmailOrUsername,
  updateById,
  deleteById,
  existsByEmail,
  existsByUsername,
};