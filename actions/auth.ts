"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import bcrypt from "bcryptjs";

import { SESSION_COOKIE } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export type LoginState = { error?: string };

export async function login(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!username || !password) return { error: "Vui lòng nhập đủ thông tin." };

  const user = await prisma.user.findFirst({
    where: { username, isActive: true, deletedAt: null },
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return { error: "Tên đăng nhập hoặc mật khẩu không đúng." };
  }

  (await cookies()).set(SESSION_COOKIE, String(user.id), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  redirect("/");
}

export async function logout() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/login");
}
