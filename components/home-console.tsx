"use client";

import { ScaleConsole } from "@/components/ScaleConsole";
import { useScaleContext } from "@/contexts/scale-context";
import Link from "next/link";

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
      <div className="flex items-center justify-between gap-3 px-6 py-5 text-sm text-slate-300">
        <span className="font-semibold uppercase tracking-[0.22em] text-slate-400">
          Digital Scale / Operator
        </span>
        <nav className="flex items-center gap-4">
          <Link href="/management" className="text-amber-400 hover:text-amber-300">
            Quản lý
          </Link>
          <Link href="/login" className="text-slate-400 hover:text-slate-200">
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
