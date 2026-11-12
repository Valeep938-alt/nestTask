"use client";

import { useSyncExternalStore } from "react";

const noSuscribir = () => () => {};

export function useIsHydrated(): boolean {
  return useSyncExternalStore(
    noSuscribir,
    () => true,
    () => false,
  );
}
