"use client";

import type { Dispatch, SetStateAction } from "react";
import type { ScaleStatus, WeightReading } from "@/drivers/WeightReading";
import type { ScaleModel } from "@/drivers/ScaleModel";
import { SCALE_MODEL_LABELS } from "@/drivers/ScaleModel";

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
  const weightText = reading ? reading.valueKg.toFixed(2) : "0.00";
  const stableLabel = reading?.stable ? "STABLE" : "UNSTABLE";
  const stableClass = reading?.stable ? "text-emerald-400" : "text-amber-400";

  return (
    <div className="flex min-h-full flex-col px-6 py-5 text-slate-50">
      <section className="mb-6 flex flex-col gap-4 rounded-3xl border border-slate-800/70 bg-slate-950/80 p-5 shadow-[0_0_80px_-24px_rgba(14,165,233,0.8)] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.35em] text-cyan-400/80">
            Scale System
          </div>
          <div className="mt-2 text-sm text-slate-300">
            Real-time weight monitor with driver abstraction
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-full border border-cyan-400/40 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-200">
            Web Serial
          </div>
          <div className="text-sm text-slate-300">
            Driver kết nối thực tế, không dùng mock data.
          </div>
        </div>
      </section>

      <section className="mb-6 flex flex-col gap-4 rounded-3xl border border-slate-800/70 bg-slate-950/80 p-5 shadow-[0_0_80px_-24px_rgba(14,165,233,0.8)] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.35em] text-cyan-400/80">
            Scale Model
          </div>
          <div className="mt-2 text-sm text-slate-300">
            Chọn chuẩn dữ liệu phù hợp với loại cân
          </div>
        </div>

        <select
          value={scaleModel}
          onChange={(event) => setScaleModel(event.target.value as ScaleModel)}
          className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition hover:border-cyan-400"
        >
          {Object.entries(SCALE_MODEL_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </section>

      <section className="grid flex-1 gap-6 sm:grid-cols-[1fr_420px]">
        <div className="flex flex-col justify-between rounded-[2rem] border border-slate-800/70 bg-slate-950/90 p-6 shadow-[0_0_50px_-28px_rgba(14,165,233,0.85)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-cyan-400/80">
                Current Weight
              </p>
              <p
                className={`mt-2 text-sm font-semibold uppercase ${stableClass}`}
              >
                {stableLabel ?? "--"}
              </p>
            </div>
            <div
              className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClasses[status]}`}
            >
              {statusLabels[status]}
            </div>
          </div>

          <div className="mt-10 flex flex-col items-start gap-4">
            <p className="text-[14vw] font-semibold leading-[0.85] text-cyan-300 sm:text-[12vw] md:text-[9vw] lg:text-[7vw]">
              {weightText}
            </p>
            <p className="text-base font-medium uppercase tracking-[0.35em] text-slate-400">
              Kilograms
            </p>
          </div>
        </div>

        <div className="space-y-4 rounded-[2rem] border border-slate-800/70 bg-slate-950/90 p-6 shadow-[0_0_40px_-20px_rgba(14,165,233,0.75)]">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-400/80">
              Connection
            </p>
            <span className="rounded-full border border-slate-700/80 px-3 py-1 text-xs text-slate-300">
              WEB-SERIAL
            </span>
          </div>

          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={isConnected ? onDisconnect : onConnect}
              className="rounded-3xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:bg-slate-700"
              disabled={hasWebSerial !== true}
            >
              {isConnected ? "Disconnect" : "Connect"}
            </button>
            <p className="text-sm text-slate-400">
              {hasWebSerial === null
                ? "Checking browser serial support..."
                : hasWebSerial
                  ? "Web Serial support is available in your browser."
                  : "Web Serial API is unavailable. Use a compatible browser."}
            </p>
            {error ? (
              <p className="rounded-2xl bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                {error}
              </p>
            ) : null}
            <div className="rounded-3xl border border-slate-800/80 bg-slate-900/60 p-4 text-sm text-slate-300">
              <div className="mb-2 text-xs uppercase tracking-[0.35em] text-slate-500">
                Payload
              </div>
              <pre className="whitespace-pre-wrap break-words text-[0.95rem] leading-6">
                {reading?.rawPayload ?? "Waiting for data..."}
              </pre>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
