"use client";

import type { Dispatch, SetStateAction } from "react";

import type { ScaleModel } from "@/drivers/ScaleModel";
import { SCALE_MODEL_LABELS } from "@/drivers/ScaleModel";
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
  const weightText = reading ? reading.valueKg.toFixed(2) : "0.00";
  const stableLabel = reading
    ? reading.stable
      ? "STABLE"
      : "UNSTABLE"
    : "WAITING FOR DATA";
  const stableClass = reading?.stable ? "text-emerald-400" : "text-amber-400";

  return (
    <div className="mx-auto flex min-h-[calc(100vh-76px)] w-full max-w-375 flex-col px-6 pb-8 pt-3 text-slate-50">
      <section className="mb-5 flex flex-col gap-4 border-b border-slate-800 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
            Weighing station 01
          </div>
          <div className="mt-2 text-sm text-slate-400">
            Real-time industrial scale monitor
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-md border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-200">
            Web Serial
          </div>
          <div className="hidden text-sm text-slate-500 sm:block">
            Live device input
          </div>
        </div>
      </section>

      <section className="mb-5 flex flex-col gap-4 border border-slate-800 bg-slate-900/60 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
            Device profile
          </div>
          <div className="mt-2 text-sm text-slate-400">
            Parser used for incoming serial payloads
          </div>
        </div>

        <select
          value={scaleModel}
          onChange={(event) => setScaleModel(event.target.value as ScaleModel)}
          className="rounded-md border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition hover:border-amber-400"
        >
          {Object.entries(SCALE_MODEL_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </section>

      <section className="grid flex-1 gap-6 sm:grid-cols-[1fr_420px]">
        <div className="flex flex-col justify-between border border-slate-800 bg-[#111820] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
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
            <p className="font-mono text-[clamp(4.5rem,12vw,11rem)] font-semibold leading-[0.85] text-slate-50">
              {weightText}
            </p>
            <p className="text-base font-medium uppercase tracking-[0.35em] text-slate-400">
              kg
            </p>
          </div>
        </div>

        <div className="space-y-4 border border-slate-800 bg-[#111820] p-6">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
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
              className="rounded-md bg-amber-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-400 disabled:bg-slate-700"
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
              <p className="rounded-md bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                {error}
              </p>
            ) : null}
            <div className="rounded-3xl border border-slate-800/80 bg-slate-900/60 p-4 text-sm text-slate-300">
              <div className="mb-2 text-xs uppercase tracking-[0.35em] text-slate-500">
                Payload
              </div>
              <pre className="whitespace-pre-wrap wrap-break-word text-[0.95rem] leading-6">
                {reading?.rawPayload ?? "Waiting for data..."}
              </pre>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
