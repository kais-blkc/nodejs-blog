import { container } from "@/core/di/inversify.config";
import { StatusCodes } from "http-status-codes";
import { PrismaClient } from "generated/prisma";
import { TYPES } from "@/core/di/types";
import request from "supertest";
import { app } from "@/app";

describe("Auth Controller (e2e)", () => {
  let prisma: PrismaClient;
  const testEmail = "usertest@example.com";

  beforeAll(async () => {
    prisma = container.get<PrismaClient>(TYPES.PrismaClient);
  });

  afterAll(async () => {
    await prisma.user.delete({
      where: {
        email: testEmail,
      },
    });

    await prisma.$disconnect();
  });

  const registerData = {
    firstName: "Test",
    lastName: "User",
    email: testEmail,
    password: "password123test",
    birthDate: "2001-01-01",
  };

  const loginData = {
    email: testEmail,
    password: "password123test",
  };

  const wrongLoginData = {
    email: "wrong@example.com",
    password: "wrongpass",
  };

  const baseUrl = "/api/auth";

  describe("POST /register", () => {
    it("register user", async () => {
      const response = await request(app)
        .post(`${baseUrl}/register`)
        .send(registerData);

      expect(response.status).toBe(StatusCodes.CREATED);
      expect(response.body).toHaveProperty("id");
    });

    it("NOT register user ", async () => {
      const response = await request(app)
        .post(`${baseUrl}/register`)
        .send({ email: "usertest@example.com" });

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body.message).toBe("Validation failed");
    });
  });

  describe("POST /login", () => {
    it("login and return token ", async () => {
      const response = await request(app)
        .post(`${baseUrl}/login`)
        .send(loginData);

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toHaveProperty("token");
    });

    it("NOT login with invalid credentials", async () => {
      const response = await request(app)
        .post(`${baseUrl}/login`)
        .send(wrongLoginData);

      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    });
  });
});
