import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { SearchParams } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function createQueryString(
  searchParams: SearchParams,
  updates: Record<string, string | number | boolean | null | undefined>,
) {
  const params = new URLSearchParams();

  Object.entries(searchParams).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => params.append(key, v));
    } else if (value !== undefined) {
      params.set(key, value);
    }
  });

  Object.entries(updates).forEach(([key, value]) => {
    if (key === "page" && Number(value) === 1) {
      params.delete(key);
    } else if (value === null || value === undefined || value === "") {
      params.delete(key);
    } else {
      params.set(key, String(value));
    }
  });

  return `?${params.toString()}`;
}

export function parseString(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export function parseBoolean(value: string | string[] | undefined) {
  const parsed = parseString(value);
  return parsed === "true" ? true : parsed === "false" ? false : undefined;
}

export function parseEnum<T extends Record<string, string>>(
  value: string | string[] | undefined,
  enumObj: T,
) {
  const parsed = parseString(value);
  return parsed && Object.values(enumObj).includes(parsed)
    ? (parsed as T[keyof T])
    : undefined;
}
