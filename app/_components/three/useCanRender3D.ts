"use client";

import { useSyncExternalStore } from "react";

// WebGL support does not change over the lifetime of a page, so the probe
// (which creates a real, GPU-backed canvas context) is computed at most once
// and cached at module scope. `getSnapshot` below is invoked by
// `useSyncExternalStore` on every render of every consumer, so recomputing
// this per-call would burn through the browser's limited concurrent-WebGL-
// context budget.
let cachedHasWebGL: boolean | null = null;

function detectWebGL(): boolean {
  if (cachedHasWebGL !== null) {
    return cachedHasWebGL;
  }
  try {
    const canvas = document.createElement("canvas");
    cachedHasWebGL = Boolean(
      canvas.getContext("webgl") ?? canvas.getContext("experimental-webgl")
    );
  } catch {
    cachedHasWebGL = false;
  }
  return cachedHasWebGL;
}

function subscribe() {
  // WebGL support never changes after page load; nothing to subscribe to.
  return () => {};
}

function getServerSnapshot(): boolean {
  return false;
}

export function useCanRender3D() {
  return useSyncExternalStore(subscribe, detectWebGL, getServerSnapshot);
}
