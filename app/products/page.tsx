import Link from "next/link";
import { redirect } from "next/navigation";

import { createProduct, deleteProduct, updateProduct } from "@/actions/products";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function ProductsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const products = await prisma.product.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <header className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
              Digital Scale / Products
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
              Quản lý sản phẩm
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/management"
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-500"
            >
              Về quản lý
            </Link>
          </div>
        </header>

        <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-800">Thêm sản phẩm mới</h2>
          <form action={createProduct} className="grid gap-4 md:grid-cols-3">
            <label className="text-sm text-slate-700">
              Mã sản phẩm
              <input
                name="code"
                required
                placeholder="SP-001"
                className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-slate-900 outline-none focus:border-cyan-500"
              />
            </label>
            <label className="text-sm text-slate-700 md:col-span-1">
              Tên sản phẩm
              <input
                name="name"
                required
                placeholder="Gạo ST25"
                className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-slate-900 outline-none focus:border-cyan-500"
              />
            </label>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full rounded-xl bg-cyan-600 px-4 py-2.5 font-semibold text-white hover:bg-cyan-500"
              >
                Thêm mới
              </button>
            </div>
          </form>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-800">Danh sách sản phẩm</h2>

          {products.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 px-6 py-8 text-center text-sm text-slate-500">
              Chưa có sản phẩm nào.
            </div>
          ) : (
            <div className="space-y-3">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex flex-col gap-1 md:flex-row md:items-center md:gap-6">
                    <span className="font-mono text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">
                      {product.code}
                    </span>
                    <span className="text-sm text-slate-700">{product.name}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <form action={updateProduct.bind(null, product.id)} className="flex gap-2">
                      <input type="hidden" name="code" value={product.code} />
                      <input
                        type="text"
                        name="name"
                        defaultValue={product.name}
                        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-cyan-500"
                      />
                      <button
                        type="submit"
                        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:border-slate-400"
                      >
                        Lưu
                      </button>
                    </form>

                    <form action={deleteProduct.bind(null, product.id)}>
                      <button
                        type="submit"
                        className="rounded-lg bg-rose-600 px-3 py-2 text-sm font-semibold text-white hover:bg-rose-500"
                      >
                        Xóa
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
