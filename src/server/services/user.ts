import prisma from "@/lib/prisma";
import { parseJwt } from "@/lib/utils";

export interface AuthPayload {
  exp: number;
  iat: number;
  jti: string;
  iss: string;
  aud: string[];
  sub: string;
  typ: string;
  azp: string;
  session_state: string;
  acr: string;
  "allowed-origins": string[];
  realm_access: { roles: string[] };
  resource_access: Record<string, { roles: string[] }>;
  scope: string;
  email_verified: false;
  name: string;
  preferred_username: string;
  given_name: string;
  family_name: string;
  email: string;
}

export async function getUserId(token: string) {
  if (!token) return null;
  const { sub: sub, preferred_username: name, email }: AuthPayload = parseJwt(token).payload;
  let finalUserId: string | null = null;

  // Nếu không có userId nhưng có email, tìm hoặc tạo user
  if (sub) {
    let user = await prisma.user.findFirst({
      where: { f_id: sub },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          f_id: sub,
          email: email,
          name: name,
        },
      });
    }

    finalUserId = user.id;
  }
  return finalUserId;
}
