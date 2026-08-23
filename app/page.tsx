"use client";

import { useCallback, useState } from "react";

import { ScaleConsole } from "@/components/ScaleConsole";

import type { ScaleModel } from "@/drivers/ScaleModel";
import { useScaleDriver } from "@/hooks/useScaleDriver";

export default function HomePage() {
  const [scaleModel, setScaleModel] = useState<ScaleModel>("generic-text");
  const {
    reading,
    status,
    error,
    connect,
    disconnect,
    isConnected,
    hasWebSerial,
  } = useScaleDriver({
    baudRate: 9600,
    scaleModel,
  });

  const handleConnect = useCallback(async () => {
    await connect();
  }, [connect]);

  const handleDisconnect = useCallback(async () => {
    await disconnect();
  }, [disconnect]);

  return (
    <main className="min-h-[calc(100vh-16px)] w-full bg-slate-950 text-slate-50">
      <div className="fixed left-0 top-0 z-20 h-4 w-full bg-slate-900 shadow-[0_4px_24px_-18px_rgba(14,165,233,0.75)]" />
      <div className="relative mx-auto flex min-h-[calc(100vh-16px)] max-w-full flex-col">
        <ScaleConsole
          reading={reading}
          status={status}
          error={error}
          isConnected={isConnected}
          onConnect={handleConnect}
          onDisconnect={handleDisconnect}
          scaleModel={scaleModel}
          setScaleModel={setScaleModel}
          hasWebSerial={hasWebSerial}
        />
      </div>
    </main>
  );
}
