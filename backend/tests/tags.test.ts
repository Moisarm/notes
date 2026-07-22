import { describe, expect, test } from "bun:test";
import request from "supertest";
import { app } from "./setup";
import { register_user } from "./helpers";

describe("Tags", () => {
  test("Full CRUD flow", async () => {
    const user = await register_user();
    const cookie = user.cookie!;
    const tagName = "tag-" + Date.now();

    const createRes = await request(app)
      .post("/api/tag")
      .set("Cookie", cookie)
      .send({ name: tagName });
    expect(createRes.status).toBe(201);
    expect(createRes.body.data).toHaveProperty("id");
    expect(createRes.body.data.name).toBe(tagName);
    const tagId = createRes.body.data.id;

    const getAllRes = await request(app)
      .get("/api/tag")
      .set("Cookie", cookie);
    expect(getAllRes.status).toBe(200);
    expect(getAllRes.body.data.items.length).toBeGreaterThanOrEqual(1);
    expect(getAllRes.body.data.items.some((t: any) => t.id === tagId)).toBe(true);

    const deleteRes = await request(app)
      .delete(`/api/tag/${tagId}`)
      .set("Cookie", cookie);
    expect(deleteRes.status).toBe(200);
    expect(deleteRes.body.message).toBe("Tag deleted successfully");

    const verifyDeleteRes = await request(app)
      .get("/api/tag")
      .set("Cookie", cookie);
    expect(
      verifyDeleteRes.body.data.items.some((t: any) => t.id === tagId),
    ).toBe(false);
  });

  test("rejects duplicate tag name for same user", async () => {
    const user = await register_user();
    const cookie = user.cookie!;
    const tagName = "unique-tag-" + Date.now();

    const first = await request(app)
      .post("/api/tag")
      .set("Cookie", cookie)
      .send({ name: tagName });
    expect(first.status).toBe(201);

    const second = await request(app)
      .post("/api/tag")
      .set("Cookie", cookie)
      .send({ name: tagName });
    expect(second.status).toBe(400);
  });

  test("allows same tag name for different users", async () => {
    const tagName = "shared-tag-" + Date.now();

    const user1 = await register_user();
    const res1 = await request(app)
      .post("/api/tag")
      .set("Cookie", user1.cookie!)
      .send({ name: tagName });
    expect(res1.status).toBe(201);

    const user2 = await register_user();
    const res2 = await request(app)
      .post("/api/tag")
      .set("Cookie", user2.cookie!)
      .send({ name: tagName });
    expect(res2.status).toBe(201);
  });

  test("rejects tag without name", async () => {
    const user = await register_user();
    const res = await request(app)
      .post("/api/tag")
      .set("Cookie", user.cookie!)
      .send({});
    expect(res.status).toBe(400);
  });

  test("returns 401 without auth", async () => {
    const res = await request(app).get("/api/tag");
    expect(res.status).toBe(401);
  });

  test("delete without auth returns 401", async () => {
    const res = await request(app).delete("/api/tag/some-id");
    expect(res.status).toBe(401);
  });
});
