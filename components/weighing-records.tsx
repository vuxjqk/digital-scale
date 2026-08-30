"use client";

import {
  useActionState,
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";

import { useRouter } from "next/navigation";

import {
  type WeighingRecordState,
  createWeighingRecord,
  deleteWeighingRecord,
} from "@/actions/weighing-records";
import { useScaleContext } from "@/contexts/scale-context";
import {
  SCALE_MODEL_LABELS,
  formatWeightByScaleModel,
} from "@/drivers/ScaleModel";

import { EmployeeCombobox } from "./employee-combobox";
import { ProductCombobox } from "./product-combobox";

type RecordRow = {
  id: number;
  productName: string;
  productCode: string;
  employeeName: string | null;
  employeeCode: string | null;
  weight: number;
  unit: string;
  weighedAt: string;
  note: string | null;
};

const initialState: WeighingRecordState = {};

export function WeighingRecords({
  records,
  products,
  employees,
  page,
  totalPages,
  basePath = "/management",
}: {
  records: RecordRow[];
  products: { id: number; code: string; name: string }[];
  employees: { id: number; fullName: string; username: string }[];
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
  const [expandedWeight, setExpandedWeight] = useState<{
    value: number;
    unit: string;
  } | null>(null);
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
    <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-cyan-600">
          Hỗ trợ cân ký sản phẩm
        </p>
        <h2 className="mt-2 text-2xl font-bold text-slate-800">
          Lưu thông tin cân
        </h2>
      </div>
      <div className="mb-6 grid gap-4 border border-slate-200 bg-slate-50 p-4 md:grid-cols-[1fr_auto_auto_auto] md:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
            Cân điện tử
          </p>
          <p className="mt-2 text-base font-medium text-slate-700">
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
            <p className="mt-2 text-sm font-medium text-rose-600">
              {scaleError}
            </p>
          ) : null}
        </div>
        <div className="text-right">
          <div
            className="inline-flex cursor-pointer items-center rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 transition-transform duration-200 hover:scale-[1.08] hover:shadow-md"
            onMouseEnter={() =>
              reading
                ? setExpandedWeight({ value: reading.valueKg, unit: "kg" })
                : null
            }
            onMouseLeave={() => setExpandedWeight(null)}
          >
            <p className="font-mono text-4xl font-extrabold tracking-tight text-cyan-700 md:text-5xl">
              {reading
                ? formatWeightByScaleModel(reading.valueKg, scaleModel)
                : "--"}
            </p>
            <span className="ml-2 text-xl font-bold text-slate-600">kg</span>
          </div>
          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            {reading?.stable ? "Ổn định" : "Đang đọc"}
          </p>
        </div>
        <label className="text-base font-medium text-slate-700">
          Loại cân
          <select
            value={scaleModel}
            onChange={(event) =>
              setScaleModel(event.target.value as typeof scaleModel)
            }
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-base text-slate-800 outline-none transition hover:border-cyan-400"
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
          className="rounded-xl bg-amber-500 px-5 py-3 text-base font-bold text-slate-900 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
        >
          {isConnected ? "Ngắt kết nối" : "Kết nối cân"}
        </button>
      </div>
      <form
        ref={formRef}
        action={formAction}
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-6"
      >
        <ProductCombobox
          key={
            state.success ? `product-reset-${state.success}` : "product-idle"
          }
          products={products}
        />
        <EmployeeCombobox
          key={
            state.success ? `employee-reset-${state.success}` : "employee-idle"
          }
          employees={employees}
        />
        <label className="text-base font-medium text-slate-700">
          Khối lượng tự động (kg)
          <input
            name="weight"
            type="hidden"
            value={reading?.valueKg ?? ""}
            readOnly
          />
          <div className="mt-2 rounded-xl border border-slate-300 bg-white px-3 py-3 font-mono text-2xl font-bold text-cyan-700 transition-transform duration-200 hover:scale-[1.03] hover:shadow-sm">
            {reading
              ? formatWeightByScaleModel(reading.valueKg, scaleModel)
              : "Chưa có dữ liệu"}
          </div>
        </label>
        <label className="text-base font-medium text-slate-700">
          Đơn vị tính *
          <select
            name="unit"
            defaultValue="kg"
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-base text-slate-800 outline-none focus:border-cyan-500"
          >
            <option value="kg">kg</option>
            <option value="g">g</option>
            <option value="tấn">tấn</option>
          </select>
        </label>
        <label className="text-base font-medium text-slate-700">
          Thời gian cân
          <input
            name="weighedAt"
            type="datetime-local"
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-base text-slate-800 outline-none focus:border-cyan-500"
          />
        </label>
        <label className="text-base font-medium text-slate-700 lg:col-span-4">
          Ghi chú
          <input
            name="note"
            placeholder="Thông tin bổ sung (không bắt buộc)"
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-base text-slate-800 outline-none focus:border-cyan-500"
          />
        </label>
        <div className="flex items-end lg:col-span-2">
          <button
            type="submit"
            disabled={isSubmitting || !canSave}
            className="w-full rounded-xl bg-cyan-600 px-5 py-3 text-base font-bold text-white hover:bg-cyan-500 disabled:cursor-wait disabled:opacity-60"
          >
            {isSubmitting
              ? "Đang lưu..."
              : canSave
                ? "Lưu số cân ổn định"
                : "Kết nối và chờ số cân ổn định"}
          </button>
        </div>
      </form>
      {expandedWeight ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/25 p-6 backdrop-blur-[2px]"
          onMouseLeave={() => setExpandedWeight(null)}
          onClick={() => setExpandedWeight(null)}
        >
          <div className="rounded-[2rem] border border-white/80 bg-white/95 px-10 py-8 text-center shadow-[0_30px_80px_rgba(15,23,42,0.28)]">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">
              Trọng lượng
            </p>
            <div className="mt-4 font-mono text-[6rem] font-black leading-none tracking-tight text-cyan-700">
              {formatWeightByScaleModel(expandedWeight.value, scaleModel)}
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-700">
              {expandedWeight.unit}
            </div>
          </div>
        </div>
      ) : null}
      {state.error ? (
        <p className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-base font-medium text-rose-700">
          {state.error}
        </p>
      ) : null}
      {state.success ? (
        <p className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-base font-medium text-emerald-700">
          {state.success}
        </p>
      ) : null}

      <div className="mt-8 overflow-x-auto">
        {records.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center text-base text-slate-500">
            Chưa có bản ghi cân nào.
          </div>
        ) : (
          <table className="w-full min-w-200 text-left text-base">
            <thead className="border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-3 py-3">Sản phẩm</th>
                <th className="px-3 py-3">Mã hàng</th>
                <th className="px-3 py-3">Nhân viên</th>
                <th className="px-3 py-3">Mã NV</th>
                <th className="px-3 py-3">Khối lượng</th>
                <th className="px-3 py-3">Thời gian cân</th>
                <th className="px-3 py-3">Ghi chú</th>
                <th className="px-3 py-3">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {records.map((record) => (
                <tr key={record.id} className="text-slate-700">
                  <td className="px-3 py-3 font-semibold text-slate-900">
                    {record.productName}
                  </td>
                  <td className="px-3 py-3">{record.productCode}</td>
                  <td className="px-3 py-3">{record.employeeName || "-"}</td>
                  <td className="px-3 py-3">{record.employeeCode || "-"}</td>
                  <td className="px-3 py-3">
                    <span
                      className="inline-flex cursor-pointer rounded-lg bg-cyan-50 px-2 py-1 font-mono text-lg font-bold text-cyan-700 transition-transform duration-200 hover:scale-[1.08]"
                      onMouseEnter={() =>
                        setExpandedWeight({
                          value: record.weight,
                          unit: record.unit,
                        })
                      }
                      onMouseLeave={() => setExpandedWeight(null)}
                    >
                      {formatWeightByScaleModel(record.weight, scaleModel)}{" "}
                      {record.unit}
                    </span>
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
                      className="rounded-lg bg-rose-100 px-3 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-200 disabled:opacity-50"
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
        <div className="mt-5 flex items-center justify-end gap-3 text-base">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => goToPage(page - 1)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 font-semibold text-slate-700 disabled:opacity-40"
          >
            Trước
          </button>
          <span className="font-medium text-slate-500">
            Trang {page}/{totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => goToPage(page + 1)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 font-semibold text-slate-700 disabled:opacity-40"
          >
            Sau
          </button>
        </div>
      ) : null}
    </section>
  );
}
