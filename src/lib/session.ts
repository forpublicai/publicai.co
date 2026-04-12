import { cookies } from "next/headers";

const COOKIE_NAME = "snad-session-id";

export async function getSessionId(): Promise<string> {
  const cookieStore = await cookies();
  const value = cookieStore.get(COOKIE_NAME)?.value;
  if (!value) {
    throw new Error("Session cookie not found");
  }
  return value;
}
