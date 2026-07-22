import { describe, expect, test } from "bun:test";
import request from "supertest";
import { app } from "./setup";
import { random_username, random_password } from "./helpers";

function randomUser() {
  return {
    username: random_username(),
    password: random_password(),
  };
}

describe("Auth - Register", () => {
  test("POST /api/auth/register - creates user and returns cookie", async () => {
    const user = randomUser();
    const res = await request(app)
      .post("/api/auth/register")
      .send(user);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("message", "User Registered");
    expect(res.body.data).toHaveProperty("user");
    expect(res.body.data.user).toHaveProperty("username", user.username);
    expect(res.headers["set-cookie"]).toBeDefined();
  });

  test("POST /api/auth/register - rejects duplicate username", async () => {
    const user = randomUser();
    await request(app).post("/api/auth/register").send(user);

    const res = await request(app)
      .post("/api/auth/register")
      .send(user);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error", "User Already exist");
  });

  test("POST /api/auth/register - rejects empty username", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ username: "", password: random_password() });

    expect(res.status).toBe(400);
  });

  test("POST /api/auth/register - rejects short password (< 8 chars)", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ username: random_username(), password: "123" });

    expect(res.status).toBe(400);
  });
});

describe("Auth - Login", () => {
  test("POST /api/auth/login - succeeds with valid credentials", async () => {
    const user = randomUser();
    await request(app).post("/api/auth/register").send(user);

    const res = await request(app)
      .post("/api/auth/login")
      .send({ username: user.username, password: user.password });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toContain("Welcome");
    expect(res.body.data).toHaveProperty("token");
    expect(res.body.data).toHaveProperty("user");
    expect(res.headers["set-cookie"]).toBeDefined();
  });

  test("POST /api/auth/login - fails with wrong password", async () => {
    const user = randomUser();
    await request(app).post("/api/auth/register").send(user);

    const res = await request(app)
      .post("/api/auth/login")
      .send({ username: user.username, password: "WrongPassword1!" });

    expect(res.status).toBe(400);
  });

  test("POST /api/auth/login - fails with non-existent user", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ username: "nonexistent_" + Date.now(), password: "TestPass123!" });

    expect(res.status).toBe(400);
  });

  test("POST /api/auth/login - rejects empty fields", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ username: "", password: "" });

    expect(res.status).toBe(400);
  });
});

describe("Auth - Me", () => {
  test("GET /api/auth/me - returns user info when authenticated", async () => {
    const user = randomUser();
    const reg = await request(app).post("/api/auth/register").send(user);

    const res = await request(app)
      .get("/api/auth/me")
      .set("Cookie", reg.headers["set-cookie"] as any);

    expect(res.status).toBe(200);
    expect(res.body.data.user).toHaveProperty("user_id");
    expect(res.body.data.user).toHaveProperty("username", user.username);
  });

  test("GET /api/auth/me - returns 401 without cookie", async () => {
    const res = await request(app).get("/api/auth/me");

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("error", "Unauthorized");
  });
});

describe("Auth - Update", () => {
  test("PUT /api/auth/update - updates username", async () => {
    const user = randomUser();
    const reg = await request(app).post("/api/auth/register").send(user);
    const newUsername = random_username();

    const res = await request(app)
      .put("/api/auth/update")
      .set("Cookie", reg.headers["set-cookie"] as any)
      .send({ username: newUsername });

    expect(res.status).toBe(201);
    expect(res.body.message).toContain("updated successfully");
  });

  test("PUT /api/auth/update - rejects duplicate username", async () => {
    const user1 = randomUser();
    const user2 = randomUser();
    await request(app).post("/api/auth/register").send(user1);
    const reg2 = await request(app).post("/api/auth/register").send(user2);

    const res = await request(app)
      .put("/api/auth/update")
      .set("Cookie", reg2.headers["set-cookie"] as any)
      .send({ username: user1.username });

    expect(res.status).toBe(400);
  });

  test("PUT /api/auth/update - returns 401 without auth", async () => {
    const res = await request(app)
      .put("/api/auth/update")
      .send({ username: random_username() });

    expect(res.status).toBe(401);
  });
});

describe("Auth - Logout", () => {
  test("POST /api/auth/logout - clears cookie", async () => {
    const user = randomUser();
    const reg = await request(app).post("/api/auth/register").send(user);

    const res = await request(app)
      .post("/api/auth/logout")
      .set("Cookie", reg.headers["set-cookie"] as any);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Session Closed");
  });
});

describe("Auth - Delete Account", () => {
  test("DELETE /api/auth/delete - deletes user account", async () => {
    const user = randomUser();
    const reg = await request(app).post("/api/auth/register").send(user);

    const res = await request(app)
      .delete("/api/auth/delete")
      .set("Cookie", reg.headers["set-cookie"] as any);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "User Has been deleted");

    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({ username: user.username, password: user.password });

    expect(loginRes.status).toBe(400);
  });
});
