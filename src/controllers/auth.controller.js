import { registerUser, loginUser } from "../services/auth.service.js";
import { successResponse } from "../utils/response.js";

export const register = async (req, res) => {
  const user = await registerUser(req.body);

  return successResponse(
    res,
    user,
    "User registered successfully",
    201
  );
};

export const login = async (req, res) => {
  const data = await loginUser(req.body);

  return successResponse(
    res,
    data,
    "Login successful",
    200
  );
};