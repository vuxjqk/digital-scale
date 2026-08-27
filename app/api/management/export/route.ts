import { NextResponse } from "next/server";

import ExcelJS from "exceljs";

import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const records = await prisma.weighingRecord.findMany({
    where: { userId: user.id },
    orderBy: { weighedAt: "desc" },
    select: {
      productName: true,
      productCode: true,
      weight: true,
      unit: true,
      weighedAt: true,
      note: true,
    },
  });

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Digital Scale";
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet("Bản ghi cân");
  worksheet.columns = [
    { header: "Sản phẩm", key: "productName", width: 28 },
    { header: "Mã hàng", key: "productCode", width: 18 },
    { header: "Khối lượng", key: "weight", width: 16 },
    { header: "Đơn vị", key: "unit", width: 12 },
    { header: "Thời gian cân", key: "weighedAt", width: 22 },
    { header: "Ghi chú", key: "note", width: 36 },
  ];

  worksheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
  worksheet.getRow(1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF334155" },
  };
  worksheet.getRow(1).alignment = { vertical: "middle" };
  worksheet.autoFilter = "A1:F1";
  worksheet.views = [{ state: "frozen", ySplit: 1 }];

  for (const record of records) {
    const row = worksheet.addRow({
      ...record,
      weighedAt: record.weighedAt,
      note: record.note ?? "",
    });
    row.getCell("weight").numFmt = "0.000";
    row.getCell("weighedAt").numFmt = "dd/mm/yyyy hh:mm";
  }

  const buffer = await workbook.xlsx.writeBuffer();
  return new NextResponse(buffer, {
    headers: {
      "Content-Disposition": 'attachment; filename="weighing-records.xlsx"',
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Cache-Control": "no-store",
    },
  });
}
