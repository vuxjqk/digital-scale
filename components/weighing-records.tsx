"use client";

import {
  useActionState,
  useCallback,
  useEffect,
  useRef,
  useTransition,
} from "react";

import { ProductCombobox } from "./product-combobox";

import { useRouter } from "next/navigation";

import {
  type WeighingRecordState,
  createWeighingRecord,
  deleteWeighingRecord,
} from "@/actions/weighing-records";
import { useScaleContext } from "@/contexts/scale-context";
import { SCALE_MODEL_LABELS } from "@/drivers/ScaleModel";

type RecordRow = {
  id: number;
  productName: string;
  productCode: string;
  weight: number;
  unit: string;
  weighedAt: string;
  note: string | null;
};

const initialState: WeighingRecordState = {};

export function WeighingRecords({
  records,
  products,
  page,
  totalPages,
  basePath = "/management",
}: {
  records: RecordRow[];
  products: { id: number; code: string; name: string }[];
  page: number;
  totalPages: number;
  basePath?: string;
}) {
  const {
    reading,
    status: scaleStatus,
    error: scaleError,
    connect,
    disconnect,
    isConnected,
    hasWebSerial,
    scaleModel,
    setScaleModel,
  } = useScaleContext();
  const [state, formAction, isSubmitting] = useActionState(
    createWeighingRecord,
    initialState,
  );
  const [isDeleting, startDeleting] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const handleConnect = useCallback(() => connect(), [connect]);
  const handleDisconnect = useCallback(() => disconnect(), [disconnect]);
  const canSave = true;

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
      router.refresh();
    }
  }, [router, state.success]);

  const goToPage = (nextPage: number) => {
    router.push(`${basePath}?page=${nextPage}`);
  };

  const handleDelete = (id: number) => {
    if (!window.confirm("Bạn có chắc muốn xóa bản ghi cân này không?")) return;
    startDeleting(async () => {
      const result = await deleteWeighingRecord(id);
      if (result.error) window.alert(result.error);
      router.refresh();
    });
  };

  return (
    <section className="mt-6 rounded-3xl border border-slate-800/70 bg-slate-950/90 p-6 shadow-[0_0_50px_-28px_rgba(14,165,233,0.85)]">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.35em] text-cyan-400/80">
          Hỗ trợ cân ký sản phẩm
        </p>
        <h2 className="mt-2 text-xl font-semibold text-slate-100">
          Lưu thông tin cân
        </h2>
      </div>
      <div className="mb-6 grid gap-4 border border-slate-800 bg-slate-900/60 p-4 md:grid-cols-[1fr_auto_auto_auto] md:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
            Cân điện tử
          </p>
          <p className="mt-2 text-sm text-slate-300">
            {scaleStatus === "connected"
              ? reading?.stable
                ? "Đã kết nối · Số cân ổn định"
                : "Đã kết nối · Đang chờ số cân ổn định"
              : scaleStatus === "connecting"
                ? "Đang kết nối với cân..."
                : scaleStatus === "error"
                  ? "Không thể kết nối với cân"
                  : "Chưa kết nối cân"}
          </p>
          {scaleError ? (
            <p className="mt-2 text-sm text-rose-300">{scaleError}</p>
          ) : null}
        </div>
        <div className="text-right">
          <p className="font-mono text-3xl font-semibold text-slate-50">
            {reading ? reading.valueKg.toFixed(3) : "--"} kg
          </p>
          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500">
            {reading?.stable ? "Stable" : "Live reading"}
          </p>
        </div>
        <label className="text-sm text-slate-300">
          Loại cân
          <select
            value={scaleModel}
            onChange={(event) =>
              setScaleModel(event.target.value as typeof scaleModel)
            }
            className="mt-2 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 outline-none transition hover:border-amber-400"
          >
            {Object.entries(SCALE_MODEL_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          onClick={isConnected ? handleDisconnect : handleConnect}
          disabled={hasWebSerial !== true || scaleStatus === "connecting"}
          className="rounded-md bg-amber-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
        >
          {isConnected ? "Ngắt kết nối" : "Kết nối cân"}
        </button>
      </div>
      <form
        ref={formRef}
        action={formAction}
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-6"
      >
        <ProductCombobox products={products} />
        <label className="text-sm text-slate-300">
          Khối lượng tự động (kg)
          <input
            name="weight"
            type="hidden"
            value={reading?.valueKg ?? ""}
            readOnly
          />
          <div className="mt-2 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 font-mono text-slate-100">
            {reading?.valueKg.toFixed(3) ?? "Chưa có dữ liệu"}
          </div>
        </label>
        <label className="text-sm text-slate-300">
          Đơn vị tính *
          <select
            name="unit"
            defaultValue="kg"
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-slate-100 outline-none focus:border-cyan-400"
          >
            <option value="kg">kg</option>
            <option value="g">g</option>
            <option value="tấn">tấn</option>
          </select>
        </label>
        <label className="text-sm text-slate-300">
          Thời gian cân
          <input
            name="weighedAt"
            type="datetime-local"
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-slate-100 outline-none focus:border-cyan-400"
          />
        </label>
        <label className="text-sm text-slate-300 lg:col-span-4">
          Ghi chú
          <input
            name="note"
            placeholder="Thông tin bổ sung (không bắt buộc)"
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-slate-100 outline-none focus:border-cyan-400"
          />
        </label>
        <div className="flex items-end lg:col-span-2">
          <button
            type="submit"
            disabled={isSubmitting || !canSave}
            className="w-full rounded-xl bg-cyan-400 px-4 py-2.5 font-semibold text-slate-950 hover:bg-cyan-300 disabled:cursor-wait disabled:opacity-60"
          >
            {isSubmitting
              ? "Đang lưu..."
              : canSave
                ? "Lưu số cân ổn định"
                : "Kết nối và chờ số cân ổn định"}
          </button>
        </div>
      </form>
      {state.error ? (
        <p className="mt-4 rounded-xl bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {state.error}
        </p>
      ) : null}
      {state.success ? (
        <p className="mt-4 rounded-xl bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          {state.success}
        </p>
      ) : null}

      <div className="mt-8 overflow-x-auto">
        {records.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-700 px-6 py-10 text-center text-sm text-slate-400">
            Chưa có bản ghi cân nào.
          </div>
        ) : (
          <table className="w-full min-w-200 text-left text-sm">
            <thead className="border-b border-slate-800 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-3 py-3">Sản phẩm</th>
                <th className="px-3 py-3">Mã hàng</th>
                <th className="px-3 py-3">Khối lượng</th>
                <th className="px-3 py-3">Thời gian cân</th>
                <th className="px-3 py-3">Ghi chú</th>
                <th className="px-3 py-3">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {records.map((record) => (
                <tr key={record.id} className="text-slate-300">
                  <td className="px-3 py-3 font-medium text-slate-100">
                    {record.productName}
                  </td>
                  <td className="px-3 py-3">{record.productCode}</td>
                  <td className="px-3 py-3">
                    {record.weight.toFixed(3)} {record.unit}
                  </td>
                  <td className="px-3 py-3">
                    {new Date(record.weighedAt).toLocaleString("vi-VN")}
                  </td>
                  <td className="max-w-48 truncate px-3 py-3">
                    {record.note || "-"}
                  </td>
                  <td className="px-3 py-3">
                    <button
                      type="button"
                      disabled={isDeleting}
                      onClick={() => handleDelete(record.id)}
                      className="text-rose-300 hover:text-rose-200 disabled:opacity-50"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {totalPages > 1 ? (
        <div className="mt-5 flex items-center justify-end gap-3 text-sm">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => goToPage(page - 1)}
            className="rounded-lg border border-slate-700 px-3 py-2 text-slate-300 disabled:opacity-40"
          >
            Trước
          </button>
          <span className="text-slate-400">
            Trang {page}/{totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => goToPage(page + 1)}
            className="rounded-lg border border-slate-700 px-3 py-2 text-slate-300 disabled:opacity-40"
          >
            Sau
          </button>
        </div>
      ) : null}
    </section>
  );
}
