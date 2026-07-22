import { app } from "./setup";
import request from "supertest";

let counter = 0;

export function random_username(): string {
  counter++;
  return `testuser_${Date.now()}_${counter}`;
}

export function random_password(): string {
  return "TestPass123!";
}

export interface TestUser {
  username: string;
  password: string;
  cookie?: string[];
}

export async function register_user(): Promise<TestUser> {
  const user: TestUser = {
    username: random_username(),
    password: random_password(),
  };

  const res = await request(app)
    .post("/api/auth/register")
    .send({ username: user.username, password: user.password });

  if (res.status === 201) {
    const cookies = res.headers["set-cookie"];
    user.cookie = Array.isArray(cookies) ? cookies : [cookies];
  }

  return user;
}

export async function login_user(user: TestUser): Promise<string[]> {
  const res = await request(app)
    .post("/api/auth/login")
    .send({ username: user.username, password: user.password });

  const cookies = res.headers["set-cookie"];
  const cookie = Array.isArray(cookies) ? cookies : [cookies];
  user.cookie = cookie;
  return cookie;
}
