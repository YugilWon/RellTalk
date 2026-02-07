import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const SECRET_KEY = process.env.JWT_SECRET!;

export function authenticateToken() {
  const token = cookies().get("accessToken")?.value;

  if (!token) {
    throw new Error("NO_TOKEN");
  }

  try {
    return jwt.verify(token, SECRET_KEY);
  } catch {
    throw new Error("INVALID_TOKEN");
  }
}
