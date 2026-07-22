import { describe, expect, test } from "bun:test";
import request from "supertest";
import { app } from "./setup";
import {
  random_username,
  random_password,
  register_user,
  login_user,
} from "./helpers";

describe("Notes", () => {
  let cookie: string[];
  let tagId: string;

  test("Full CRUD flow", async () => {
    const user = await register_user();
    cookie = user.cookie!;

    const tagRes = await request(app)
      .post("/api/tag")
      .set("Cookie", cookie)
      .send({ name: "test-tag-" + Date.now() });
    expect(tagRes.status).toBe(201);
    tagId = tagRes.body.data.id;

    const createRes = await request(app)
      .post("/api/note")
      .set("Cookie", cookie)
      .send({
        title: "Test Note",
        content: "This is test content",
        tag_ids: [tagId],
      });

    expect(createRes.status).toBe(201);
    expect(createRes.body.data).toHaveProperty("id");
    expect(createRes.body.data.title).toBe("Test Note");
    expect(createRes.body.data.tags).toHaveLength(1);
    const noteId = createRes.body.data.id;

    const getAllRes = await request(app)
      .get("/api/note")
      .set("Cookie", cookie);
    expect(getAllRes.status).toBe(200);
    expect(getAllRes.body.data.items.length).toBeGreaterThanOrEqual(1);

    const updateRes = await request(app)
      .put(`/api/note/${noteId}`)
      .set("Cookie", cookie)
      .send({ title: "Updated Title", content: "Updated content" });
    expect(updateRes.status).toBe(200);
    expect(updateRes.body.data.title).toBe("Updated Title");

    const archiveRes = await request(app)
      .patch(`/api/note/${noteId}/archive`)
      .set("Cookie", cookie);
    expect(archiveRes.status).toBe(200);
    expect(archiveRes.body.data.is_archived).toBe(true);

    const archivedFilterRes = await request(app)
      .get("/api/note?archived=true")
      .set("Cookie", cookie);
    expect(archivedFilterRes.status).toBe(200);
    expect(
      archivedFilterRes.body.data.items.some((n: any) => n.id === noteId),
    ).toBe(true);

    const unarchiveRes = await request(app)
      .patch(`/api/note/${noteId}/archive`)
      .set("Cookie", cookie);
    expect(unarchiveRes.status).toBe(200);
    expect(unarchiveRes.body.data.is_archived).toBe(false);

    const deleteRes = await request(app)
      .delete(`/api/note/${noteId}`)
      .set("Cookie", cookie);
    expect(deleteRes.status).toBe(200);
    expect(deleteRes.body.message).toBe("Note deleted successfully");

    const getDeletedRes = await request(app)
      .get("/api/note")
      .set("Cookie", cookie);
    expect(
      getDeletedRes.body.data.items.some((n: any) => n.id === noteId),
    ).toBe(false);
  });

  test("returns 401 without auth", async () => {
    const res = await request(app).get("/api/note");
    expect(res.status).toBe(401);
  });

  test("create note without auth returns 401", async () => {
    const res = await request(app)
      .post("/api/note")
      .send({ title: "Test", content: "Content" });
    expect(res.status).toBe(401);
  });

  test("create note with invalid tag_id fails", async () => {
    const user = await register_user();
    const res = await request(app)
      .post("/api/note")
      .set("Cookie", user.cookie!)
      .send({
        title: "Test Note",
        content: "Content",
        tag_ids: ["00000000-0000-0000-0000-000000000000"],
      });
    expect(res.status).toBe(400);
  });
});
