"use server";

import { revalidatePath } from "next/cache";

import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export type WeighingRecordState = {
  error?: string;
  success?: string;
};

export async function createWeighingRecord(
  _previousState: WeighingRecordState,
  formData: FormData,
): Promise<WeighingRecordState> {
  const user = await getCurrentUser();
  if (!user) return { error: "Phiên đăng nhập đã hết hạn." };

  const productName = String(formData.get("productName") ?? "").trim();
  const productCode = String(formData.get("productCode") ?? "").trim();
  const employeeCode = String(formData.get("employeeCode") ?? "").trim();
  const employeeName = String(formData.get("employeeName") ?? "").trim();
  const weight = Number(formData.get("weight"));
  const unit = String(formData.get("unit") ?? "kg").trim();
  const weighedAtValue = String(formData.get("weighedAt") ?? "");
  const note = String(formData.get("note") ?? "").trim();
  const weighedAt = weighedAtValue ? new Date(weighedAtValue) : new Date();

  if (!productName || !productCode || !unit) {
    return { error: "Vui lòng nhập đủ sản phẩm, mã hàng và đơn vị tính." };
  }
  if (!Number.isFinite(weight) || weight <= 0) {
    return { error: "Khối lượng phải là số lớn hơn 0." };
  }
  if (Number.isNaN(weighedAt.getTime())) {
    return { error: "Thời gian cân không hợp lệ." };
  }

  await prisma.weighingRecord.create({
    data: {
      productName,
      productCode,
      employeeCode: employeeCode || null,
      employeeName: employeeName || null,
      weight,
      unit,
      weighedAt,
      note: note || null,
      userId: user.id,
    },
  });

  revalidatePath("/management");
  return { success: "Đã lưu bản ghi cân." };
}

export async function deleteWeighingRecord(id: number) {
  const user = await getCurrentUser();
  if (!user) return { error: "Phiên đăng nhập đã hết hạn." };

  await prisma.weighingRecord.deleteMany({ where: { id, userId: user.id } });
  revalidatePath("/management");
  return { success: true };
}
