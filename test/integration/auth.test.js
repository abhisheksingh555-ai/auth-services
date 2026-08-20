import "dotenv/config";
import { beforeAll, afterAll, describe, expect, it } from "vitest";
import request from "supertest";
import mongoose from "mongoose";

import app from "../../src/app.js";
import User from "../../src/models/user.model.js";

describe("Auth API", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
  });

  afterAll(async () => {
    await User.deleteMany({
      email: "test.auth@example.com",
    });

    await mongoose.connection.close();
  });

  describe("POST /api/auth/register", () => {
    it("should register a new user", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send({
          name: "Test User",
          email: "test.auth@example.com",
          phone: "9876543210",
          password: "StrongPassword123!",
        });

      expect(response.status).toBe(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("User registered successfully");

      expect(response.body.data).toMatchObject({
        name: "Test User",
        email: "test.auth@example.com",
        phone: "9876543210",
      });

      expect(response.body.data.password).toBeUndefined();
    });

    it("should reject duplicate email", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send({
          name: "Test User",
          email: "test.auth@example.com",
          phone: "9999999999",
          password: "StrongPassword123!",
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it("should reject invalid registration data", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send({
          name: "A",
          email: "invalid-email",
          phone: "123",
          password: "123",
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe("POST /api/auth/login", () => {
    beforeAll(async () => {
      await request(app)
        .post("/api/auth/register")
        .send({
          name: "Login Test",
          email: "test.auth@example.com",
          phone: "9876543210",
          password: "StrongPassword123!",
        });
    });

    it("should login with valid credentials", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "test.auth@example.com",
          password: "StrongPassword123!",
        });

      expect(response.status).toBe(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Login successful");

      expect(response.body.data).toMatchObject({
        email: "test.auth@example.com",
      });

      expect(response.body.data.password).toBeUndefined();
    });

    it("should reject incorrect password", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "test.auth@example.com",
          password: "WrongPassword123!",
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it("should reject non-existing user", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "doesnotexist@example.com",
          password: "StrongPassword123!",
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
});