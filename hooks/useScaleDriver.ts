"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ScaleDriverFactory } from "@/drivers/ScaleDriverFactory";
import type { ScaleModel } from "@/drivers/ScaleModel";
import type { ScaleStatus, WeightReading } from "@/drivers/WeightReading";

export interface UseScaleDriverOptions {
  baudRate?: number;
  scaleModel?: ScaleModel;
}

export function useScaleDriver(options: UseScaleDriverOptions) {
  const [reading, setReading] = useState<WeightReading | null>(null);
  const [status, setStatus] = useState<ScaleStatus>("disconnected");
  const [error, setError] = useState<string | undefined>(undefined);

  const driver = useMemo(
    () => ScaleDriverFactory.create("web-serial", options),
    [options?.baudRate, options?.scaleModel],
  );

  const [hasWebSerial, setHasWebSerial] = useState<boolean | null>(null);

  useEffect(() => {
    setHasWebSerial(typeof navigator !== "undefined" && "serial" in navigator);
  }, []);

  const connect = useCallback(async () => {
    setError(undefined);
    try {
      await driver.connect();
      setStatus(driver.getStatus());
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : String(caught);
      setError(message || "Failed to connect to scale");
      setStatus("error");
    }
  }, [driver]);

  const disconnect = useCallback(async () => {
    await driver.disconnect();
    setStatus(driver.getStatus());
  }, [driver]);

  useEffect(() => {
    const callback = (nextReading: WeightReading) => {
      setReading(nextReading);
    };

    driver.onWeightUpdate(callback);

    return () => {
      driver.removeWeightUpdate(callback);
      void driver.disconnect();
    };
  }, [driver]);

  return {
    reading,
    status,
    error,
    connect,
    disconnect,
    isConnected: status === "connected",
    hasWebSerial,
  };
}
