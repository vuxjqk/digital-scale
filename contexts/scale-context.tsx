"use client";

import {
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  createContext,
  useContext,
} from "react";

import type { ScaleModel } from "@/drivers/ScaleModel";
import type { ScaleStatus, WeightReading } from "@/drivers/WeightReading";
import { useScaleDriver } from "@/hooks/useScaleDriver";

type ScaleContextValue = {
  reading: WeightReading | null;
  status: ScaleStatus;
  error?: string;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  isConnected: boolean;
  hasWebSerial: boolean | null;
  scaleModel: ScaleModel;
  setScaleModel: Dispatch<SetStateAction<ScaleModel>>;
};

const ScaleContext = createContext<ScaleContextValue | null>(null);

export function ScaleProvider({ children }: { children: ReactNode }) {
  const scale = useScaleDriver({ baudRate: 9600 });

  return (
    <ScaleContext.Provider value={scale}>{children}</ScaleContext.Provider>
  );
}

export function useScaleContext() {
  const context = useContext(ScaleContext);
  if (!context) {
    throw new Error("useScaleContext must be used within ScaleProvider");
  }
  return context;
}
