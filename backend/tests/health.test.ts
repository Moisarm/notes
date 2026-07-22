import { describe, expect, test } from "bun:test";
import request from "supertest";
import { app } from "./setup";

describe("Health Endpoint", () => {
  test("GET /api/ returns 200 with server status", async () => {
    const res = await request(app).get("/api/");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("status", 200);
    expect(res.body).toHaveProperty("message", "Server Running");
  });

  test("GET /api/health returns 404 (no such route)", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(404);
  });
});
