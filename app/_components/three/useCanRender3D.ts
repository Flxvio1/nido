"use client";

import { useSyncExternalStore } from "react";

const MEDIA_QUERY = "(min-width: 768px)";

function detectWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      canvas.getContext("webgl") ?? canvas.getContext("experimental-webgl")
    );
  } catch {
    return false;
  }
}

function subscribe(onStoreChange: () => void) {
  const mediaQueryList = window.matchMedia(MEDIA_QUERY);
  mediaQueryList.addEventListener("change", onStoreChange);
  return () => mediaQueryList.removeEventListener("change", onStoreChange);
}

function getSnapshot(): boolean {
  return window.matchMedia(MEDIA_QUERY).matches && detectWebGL();
}

function getServerSnapshot(): boolean {
  return false;
}

export function useCanRender3D() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
