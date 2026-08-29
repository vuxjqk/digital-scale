"use server";

import { revalidatePath } from "next/cache";

import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function createProduct(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Phiên đăng nhập đã hết hạn.");

  const code = String(formData.get("code") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();

  if (!code || !name) {
    throw new Error("Vui lòng nhập mã sản phẩm và tên sản phẩm.");
  }

  await prisma.product.upsert({
    where: { code },
    update: { name },
    create: { code, name },
  });

  revalidatePath("/products");
  revalidatePath("/management");
}

export async function updateProduct(id: number, formData: FormData) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Phiên đăng nhập đã hết hạn.");

  const code = String(formData.get("code") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();

  if (!code || !name) {
    throw new Error("Vui lòng nhập mã sản phẩm và tên sản phẩm.");
  }

  await prisma.product.update({
    where: { id },
    data: { code, name },
  });

  revalidatePath("/products");
  revalidatePath("/management");
}

export async function deleteProduct(id: number) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Phiên đăng nhập đã hết hạn.");

  await prisma.product.delete({ where: { id } });

  revalidatePath("/products");
  revalidatePath("/management");
}
