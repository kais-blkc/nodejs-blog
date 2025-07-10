import { container } from "@/core/di/inversify.config";
import { generateJwt } from "../helpers/generate_jwt";
import { StatusCodes } from "http-status-codes";
import { PrismaClient } from "generated/prisma";
import { TYPES } from "@/core/di/types";
import request from "supertest";
import { app } from "@/app";

describe("Users Controller (e2e)", () => {
  let prisma: PrismaClient;
  let adminToken: string;
  let userToken: string;
  let adminUser: any;
  let regularUser: any;

  const adminEmail = "admin123@mail.com";
  const userEmail = "user123@mail.com";
  const baseUrl = "/api/users";
  const birthDate = new Date("2001-01-01").toISOString();

  beforeAll(async () => {
    prisma = container.get<PrismaClient>(TYPES.PrismaClient);

    adminUser = await prisma.user.create({
      data: {
        email: adminEmail,
        password: "hashedPassword",
        firstName: "Admin",
        lastName: "User",
        role: "ADMIN",
        birthDate,
      },
    });

    regularUser = await prisma.user.create({
      data: {
        email: userEmail,
        password: "hashedPassword",
        firstName: "Regular",
        lastName: "User",
        role: "USER",
        birthDate,
      },
    });

    adminToken = generateJwt(adminUser.id, adminEmail, "ADMIN");
    userToken = generateJwt(regularUser.id, userEmail, "USER");
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: {
        email: {
          in: [adminEmail, userEmail],
        },
      },
    });
    await prisma.$disconnect();
  });

  describe("GET /users", () => {
    it(" NOT ALLOW UNAUTHORIZED user get users list", async () => {
      await request(app).get(baseUrl).expect(StatusCodes.UNAUTHORIZED);
    });

    it("NOT ALLOW regular user get users list", async () => {
      await request(app)
        .get(baseUrl)
        .set("Authorization", `Bearer ${userToken}`)
        .expect(StatusCodes.FORBIDDEN);
    });

    it("ALLOW admin get users list", async () => {
      const res = await request(app)
        .get(baseUrl)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(StatusCodes.OK);

      expect(res.body.length).toBeGreaterThan(0);
    });
  });

  describe("GET /users/:id", () => {
    it("NOT ALLOW UNAUTHORIZED user get user by id", async () => {
      await request(app)
        .get(`${baseUrl}/${regularUser.id}`)
        .expect(StatusCodes.UNAUTHORIZED);
    });

    it("ALLOW self or admin get user by id", async () => {
      await request(app)
        .get(`${baseUrl}/${regularUser.id}`)
        .set("Authorization", `Bearer ${userToken}`)
        .expect(StatusCodes.OK);

      await request(app)
        .get(`${baseUrl}/${regularUser.id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(StatusCodes.OK);
    });

    it("return 404 if user not found", async () => {
      await request(app)
        .get(`${baseUrl}/invalidId`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(StatusCodes.NOT_FOUND);
    });
  });

  describe("PATCH /users/:id", () => {
    it("NOT ALLOW UNAUTHORIZED to UPDATE user", async () => {
      await request(app)
        .patch(`${baseUrl}/${regularUser.id}`)
        .send({ name: "Updated Name" })
        .expect(StatusCodes.UNAUTHORIZED);
    });

    it("ALLOW user UPDATE own profile", async () => {
      const newName = "Updated Name";

      await request(app)
        .patch(`${baseUrl}/${regularUser.id}`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({ firstName: newName })
        .expect(StatusCodes.OK);

      const updatedUser = await prisma.user.findUnique({
        where: { id: regularUser.id },
      });

      expect(updatedUser?.firstName).toEqual(newName);
    });

    it("ALLOW admin UPDATE any user", async () => {
      const newName = "Admin Updated Name";

      await request(app)
        .patch(`${baseUrl}/${adminUser.id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ firstName: newName })
        .expect(StatusCodes.OK);

      const updatedUser = await prisma.user.findUnique({
        where: { id: adminUser.id },
      });

      expect(updatedUser?.firstName).toEqual(newName);
    });

    it("NOT ALLOW regular user UPDATE another user", async () => {
      await request(app)
        .patch(`${baseUrl}/${adminUser.id}`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({ firstName: "Hacker Attempt" })
        .expect(StatusCodes.FORBIDDEN);
    });
  });

  describe("PATCH /users/:id/role", () => {
    it("NOT ALLOW non-admin CHANGE ROLE", async () => {
      await request(app)
        .patch(`${baseUrl}/${regularUser.id}/role`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({ role: "ADMIN" })
        .expect(StatusCodes.FORBIDDEN);
    });

    it("ALLOW admin CHANGE role", async () => {
      await request(app)
        .patch(`${baseUrl}/${regularUser.id}/role`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ role: "ADMIN" })
        .expect(StatusCodes.OK);

      const updatedUser = await prisma.user.findUnique({
        where: { id: regularUser.id },
      });

      expect(updatedUser?.role).toEqual("ADMIN");
    });
  });
});
