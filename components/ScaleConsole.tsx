"use client";

import type { Dispatch, SetStateAction } from "react";

import type { ScaleModel } from "@/drivers/ScaleModel";
import {
  SCALE_MODEL_LABELS,
  formatWeightByScaleModel,
} from "@/drivers/ScaleModel";
import type { ScaleStatus, WeightReading } from "@/drivers/WeightReading";

interface ScaleConsoleProps {
  reading: WeightReading | null;
  status: ScaleStatus;
  isConnected: boolean;
  error?: string;
  onConnect: () => Promise<void>;
  onDisconnect: () => Promise<void>;
  scaleModel: ScaleModel;
  setScaleModel: Dispatch<SetStateAction<ScaleModel>>;
  hasWebSerial: boolean | null;
}

const statusClasses: Record<ScaleStatus, string> = {
  connected: "bg-emerald-500 text-slate-950",
  disconnected: "bg-slate-700 text-slate-200",
  connecting: "bg-cyan-500 text-slate-950",
  error: "bg-rose-500 text-slate-950",
};

const statusLabels: Record<ScaleStatus, string> = {
  connected: "CONNECTED",
  disconnected: "DISCONNECTED",
  connecting: "CONNECTING",
  error: "ERROR",
};

export function ScaleConsole({
  reading,
  status,
  isConnected,
  error,
  onConnect,
  onDisconnect,
  scaleModel,
  setScaleModel,
  hasWebSerial,
}: ScaleConsoleProps) {
  const weightText = reading
    ? formatWeightByScaleModel(reading.valueKg, scaleModel)
    : formatWeightByScaleModel(0, scaleModel);
  const stableLabel = reading
    ? reading.stable
      ? "ỔN ĐỊNH"
      : "CHƯA ỔN ĐỊNH"
    : "ĐANG CHỜ DỮ LIỆU";
  const stableClass = reading?.stable ? "text-emerald-600" : "text-amber-600";

  return (
    <div className="mx-auto flex min-h-[calc(100vh-76px)] w-full max-w-375 flex-col px-6 pb-8 pt-3 text-slate-800">
      <section className="mb-5 flex flex-col gap-4 border-b border-slate-200 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.28em] text-slate-500">
            Trạm cân 01
          </div>
          <div className="mt-2 text-base text-slate-600">
            Màn hình cân thời gian thực
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-base font-semibold text-slate-700">
            Web Serial
          </div>
          <div className="hidden text-base text-slate-500 sm:block">
            Đầu vào thiết bị trực tiếp
          </div>
        </div>
      </section>

      <section className="mb-5 flex flex-col gap-4 border border-slate-200 bg-slate-50 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.28em] text-slate-500">
            Thiết bị
          </div>
          <div className="mt-2 text-base text-slate-600">
            Bộ phân tích dữ liệu từ cổng serial
          </div>
        </div>

        <select
          value={scaleModel}
          onChange={(event) => setScaleModel(event.target.value as ScaleModel)}
          className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-800 outline-none transition hover:border-cyan-500"
        >
          {Object.entries(SCALE_MODEL_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </section>

      <section className="grid flex-1 gap-6 sm:grid-cols-[1fr_420px]">
        <div className="flex flex-col justify-between border border-slate-200 bg-white p-6 shadow-[0_10px_25px_rgba(15,23,42,0.05)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-slate-500">
                Trọng lượng hiện tại
              </p>
              <p
                className={`mt-2 text-base font-bold uppercase ${stableClass}`}
              >
                {stableLabel ?? "--"}
              </p>
            </div>
            <div
              className={`rounded-full px-3 py-1 text-xs font-bold ${statusClasses[status]}`}
            >
              {statusLabels[status]}
            </div>
          </div>

          <div className="mt-10 flex flex-col items-start gap-4">
            <p className="font-mono text-[clamp(4.5rem,12vw,11rem)] font-bold leading-[0.85] text-cyan-700">
              {weightText}
            </p>
            <p className="text-xl font-bold uppercase tracking-[0.35em] text-slate-600">
              kg
            </p>
          </div>
        </div>

        <div className="space-y-4 border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-slate-500">
              Kết nối
            </p>
            <span className="rounded-full border border-slate-300 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
              WEB-SERIAL
            </span>
          </div>

          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={isConnected ? onDisconnect : onConnect}
              className="rounded-xl bg-amber-500 px-4 py-3 text-base font-bold text-slate-900 transition hover:bg-amber-400 disabled:bg-slate-300"
              disabled={hasWebSerial !== true}
            >
              {isConnected ? "Ngắt kết nối" : "Kết nối"}
            </button>
            <p className="text-base text-slate-600">
              {hasWebSerial === null
                ? "Đang kiểm tra hỗ trợ Web Serial..."
                : hasWebSerial
                  ? "Trình duyệt của bạn hỗ trợ Web Serial."
                  : "Thiết bị này không hỗ trợ Web Serial. Hãy dùng trình duyệt tương thích."}
            </p>
            {error ? (
              <p className="rounded-lg bg-rose-50 px-4 py-3 text-base font-medium text-rose-700">
                {error}
              </p>
            ) : null}
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-base text-slate-700">
              <div className="mb-2 text-xs font-bold uppercase tracking-[0.35em] text-slate-500">
                Dữ liệu
              </div>
              <pre className="whitespace-pre-wrap wrap-break-word text-[0.95rem] leading-6 text-slate-700">
                {reading?.rawPayload ?? "Đang chờ dữ liệu..."}
              </pre>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
