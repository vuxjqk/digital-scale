import { cookies } from "next/headers";

import { prisma } from "@/lib/prisma";

const SESSION_COOKIE = "digital_scale_session";

export async function getCurrentUser() {
  const session = (await cookies()).get(SESSION_COOKIE)?.value;
  const userId = Number(session);

  if (!Number.isInteger(userId) || userId <= 0) return null;

  return prisma.user.findFirst({
    where: { id: userId, isActive: true, deletedAt: null },
    select: { id: true, fullName: true, username: true, role: true },
  });
}

export { SESSION_COOKIE };
