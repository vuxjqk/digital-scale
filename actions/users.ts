"use server";

import { revalidatePath } from "next/cache";

import bcrypt from "bcryptjs";

import { Role } from "@/app/generated/prisma/client";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function createEmployee(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Phiên đăng nhập đã hết hạn.");

  const code = String(formData.get("code") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();

  if (!code || !name) {
    throw new Error("Vui lòng nhập mã nhân viên và tên nhân viên.");
  }

  const hashedPassword = await bcrypt.hash("123456", 10);

  await prisma.user.upsert({
    where: { username: code },
    update: {
      fullName: name,
      role: Role.EMPLOYEE,
      isActive: true,
    },
    create: {
      username: code,
      fullName: name,
      password: hashedPassword,
      role: Role.EMPLOYEE,
      isActive: true,
    },
  });

  revalidatePath("/employees");
  revalidatePath("/management");
}

export async function updateEmployee(id: number, formData: FormData) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Phiên đăng nhập đã hết hạn.");

  const code = String(formData.get("code") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();

  if (!code || !name) {
    throw new Error("Vui lòng nhập mã nhân viên và tên nhân viên.");
  }

  await prisma.user.update({
    where: { id },
    data: {
      username: code,
      fullName: name,
      role: Role.EMPLOYEE,
    },
  });

  revalidatePath("/employees");
  revalidatePath("/management");
}

export async function deleteEmployee(id: number) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Phiên đăng nhập đã hết hạn.");

  const employee = await prisma.user.findUnique({ where: { id } });
  if (!employee) return;
  if (employee.role === Role.ADMIN) {
    throw new Error("Không thể xóa tài khoản quản trị viên.");
  }

  await prisma.user.delete({ where: { id } });

  revalidatePath("/employees");
  revalidatePath("/management");
}
