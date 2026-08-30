"use client";

import Link from "next/link";

import { ScaleConsole } from "@/components/ScaleConsole";

import { useScaleContext } from "@/contexts/scale-context";

export function HomeConsole() {
  const {
    reading,
    status,
    error,
    connect,
    disconnect,
    isConnected,
    hasWebSerial,
    scaleModel,
    setScaleModel,
  } = useScaleContext();

  return (
    <>
      <div className="flex items-center justify-between gap-3 px-6 py-5 text-base text-slate-700">
        <span className="font-bold uppercase tracking-[0.22em] text-slate-600">
          Digital Scale / Người dùng
        </span>
        <nav className="flex items-center gap-4">
          <Link
            href="/management"
            className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-2 font-semibold text-amber-700 transition hover:bg-amber-100"
          >
            Quản lý
          </Link>
          <Link
            href="/login"
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 transition hover:border-slate-400"
          >
            Đăng nhập
          </Link>
        </nav>
      </div>
      <ScaleConsole
        reading={reading}
        status={status}
        error={error}
        isConnected={isConnected}
        onConnect={connect}
        onDisconnect={disconnect}
        scaleModel={scaleModel}
        setScaleModel={setScaleModel}
        hasWebSerial={hasWebSerial}
      />
    </>
  );
}
