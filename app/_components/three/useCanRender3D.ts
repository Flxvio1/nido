"use client";

import { useSyncExternalStore } from "react";

const MEDIA_QUERY = "(min-width: 768px)";

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

// Share a single MediaQueryList between the subscription and the snapshot
// read instead of creating a new one on every call.
let mediaQueryList: MediaQueryList | null = null;

function getMediaQueryList(): MediaQueryList {
  if (!mediaQueryList) {
    mediaQueryList = window.matchMedia(MEDIA_QUERY);
  }
  return mediaQueryList;
}

function subscribe(onStoreChange: () => void) {
  const mql = getMediaQueryList();
  mql.addEventListener("change", onStoreChange);
  return () => mql.removeEventListener("change", onStoreChange);
}

function getSnapshot(): boolean {
  return getMediaQueryList().matches && detectWebGL();
}

function getServerSnapshot(): boolean {
  return false;
}

export function useCanRender3D() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
