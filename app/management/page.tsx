import Link from "next/link";
import { redirect } from "next/navigation";

import { WeighingRecords } from "@/components/weighing-records";

import { logout } from "@/actions/auth";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageProps } from "@/types";

const PAGE_SIZE = 10;

export default async function ManagementPage({ searchParams }: PageProps) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const params = await searchParams;
  const requestedPage = Number(params.page);
  const page = Math.max(Number.isInteger(requestedPage) ? requestedPage : 1, 1);
  const [totalItems, products] = await Promise.all([
    prisma.weighingRecord.count({
      where: { userId: user.id },
    }),
    prisma.product.findMany({
      orderBy: { name: "asc" },
      select: { id: true, code: true, name: true },
    }),
  ]);
  const totalPages = Math.max(Math.ceil(totalItems / PAGE_SIZE), 1);
  const currentPage = Math.min(page, totalPages);
  const records = await prisma.weighingRecord.findMany({
    where: { userId: user.id },
    orderBy: { weighedAt: "desc" },
    skip: (currentPage - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
  });

  return (
    <main className="min-h-screen w-full bg-slate-100 text-slate-900">
      <div className="h-1 w-full bg-amber-500" />
      <div className="mx-auto max-w-7xl px-6 py-8">
        <header className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
              Digital Scale / Management
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
              Quản lý bản ghi cân
            </h1>
          </div>
          <Link
            href="/"
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-500"
          >
            Về màn hình cân
          </Link>
          <Link
            href="/products"
            className="rounded-lg border border-cyan-300 bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-700 transition hover:border-cyan-500"
          >
            Quản lý sản phẩm
          </Link>
          <a
            href="/api/management/export"
            className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Xuất Excel
          </a>
          <form action={logout}>
            <button
              type="submit"
              className="text-sm font-semibold text-slate-500 hover:text-slate-900"
            >
              Đăng xuất
            </button>
          </form>
        </header>
        <WeighingRecords
          products={products}
          records={records.map((record) => ({
            ...record,
            weighedAt: record.weighedAt.toISOString(),
          }))}
          page={currentPage}
          totalPages={totalPages}
        />
      </div>
    </main>
  );
}
