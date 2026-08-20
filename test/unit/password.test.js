import { describe, it, expect } from "vitest";
import {
  hashPassword,
  verifyPassword,
} from "../../src/utils/password.js";

describe("Password Utils", () => {
  const password = "StrongPassword123!";

  describe("hashPassword()", () => {
    it("should return a hashed password", async () => {
      const hash = await hashPassword(password);

      expect(hash).toBeTypeOf("string");
      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(0);
    });

    it("should generate a different hash for the same password", async () => {
      const firstHash = await hashPassword(password);
      const secondHash = await hashPassword(password);

      expect(firstHash).not.toBe(secondHash);
    });
  });

  describe("verifyPassword()", () => {
    it("should return true for the correct password", async () => {
      const hash = await hashPassword(password);

      const result = await verifyPassword(hash, password);

      expect(result).toBe(true);
    });

    it("should return false for an incorrect password", async () => {
      const hash = await hashPassword(password);

      const result = await verifyPassword(hash, "WrongPassword123!");

      expect(result).toBe(false);
    });

    it("should return false when password is completely different", async () => {
      const hash = await hashPassword(password);

      const result = await verifyPassword(
        hash,
        "AnotherCompletelyDifferentPassword!"
      );

      expect(result).toBe(false);
    });
  });
});