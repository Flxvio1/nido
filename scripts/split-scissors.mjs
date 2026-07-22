// Reorders the triangles of public/scissors.glb so that the three connected
// components of the mesh (right half, left half, pivot screw) occupy
// contiguous index ranges, and writes the result to public/scissors-split.glb.
// The runtime (ScissorsScene) slices the index buffer by those ranges to get
// three independently transformable meshes without any per-load analysis.
// Re-run with `node scripts/split-scissors.mjs` if the source model changes,
// then update the ranges printed at the end inside ScissorsScene.tsx.
import { readFileSync, writeFileSync } from "node:fs";

const SRC = "public/scissors.glb";
const DST = "public/scissors-split.glb";

const buf = readFileSync(SRC);
const jsonLen = buf.readUInt32LE(12);
const json = JSON.parse(buf.slice(20, 20 + jsonLen).toString("utf8"));
const binStart = 20 + jsonLen + 8;

function accessorInfo(idx) {
  const a = json.accessors[idx];
  const bv = json.bufferViews[a.bufferView];
  const byteOffset = binStart + (bv.byteOffset ?? 0) + (a.byteOffset ?? 0);
  const componentSize = { 5123: 2, 5125: 4, 5126: 4 }[a.componentType];
  const componentCount = { SCALAR: 1, VEC2: 2, VEC3: 3 }[a.type];
  return { accessor: a, byteOffset, componentSize, componentCount };
}

function readAccessor(idx) {
  const { accessor, byteOffset, componentCount } = accessorInfo(idx);
  const len = accessor.count * componentCount;
  const Ctor = { 5123: Uint16Array, 5125: Uint32Array, 5126: Float32Array }[
    accessor.componentType
  ];
  return new Ctor(buf.buffer, buf.byteOffset + byteOffset, len);
}

const prim = json.meshes[0].primitives[0];
const pos = readAccessor(prim.attributes.POSITION);
const indices = readAccessor(prim.indices);
const vertexCount = pos.length / 3;

// Weld duplicated vertices by quantized position so connectivity crosses
// normal/uv seams.
const weld = new Int32Array(vertexCount);
{
  const seen = new Map();
  for (let i = 0; i < vertexCount; i++) {
    const key =
      Math.round(pos[3 * i] * 1e5) +
      "," +
      Math.round(pos[3 * i + 1] * 1e5) +
      "," +
      Math.round(pos[3 * i + 2] * 1e5);
    const existing = seen.get(key);
    if (existing === undefined) {
      seen.set(key, i);
      weld[i] = i;
    } else {
      weld[i] = existing;
    }
  }
}

// Union-find over welded vertices.
const parent = new Int32Array(vertexCount);
for (let i = 0; i < vertexCount; i++) parent[i] = i;
function find(a) {
  while (parent[a] !== a) {
    parent[a] = parent[parent[a]];
    a = parent[a];
  }
  return a;
}
function union(a, b) {
  a = find(a);
  b = find(b);
  if (a !== b) parent[a] = b;
}
for (let t = 0; t < indices.length; t += 3) {
  union(weld[indices[t]], weld[indices[t + 1]]);
  union(weld[indices[t]], weld[indices[t + 2]]);
}

// Collect per-component triangle lists and bounding boxes.
const comps = new Map();
for (let t = 0; t < indices.length; t += 3) {
  const root = find(weld[indices[t]]);
  let c = comps.get(root);
  if (!c) {
    c = { tris: [], min: [1e9, 1e9, 1e9], max: [-1e9, -1e9, -1e9] };
    comps.set(root, c);
  }
  c.tris.push(t);
  for (const vi of [indices[t], indices[t + 1], indices[t + 2]]) {
    for (let d = 0; d < 3; d++) {
      const v = pos[3 * vi + d];
      if (v < c.min[d]) c.min[d] = v;
      if (v > c.max[d]) c.max[d] = v;
    }
  }
}

const list = [...comps.values()];
if (list.length !== 3) {
  throw new Error(`expected 3 connected components, got ${list.length}`);
}

// Classify: the screw is the component with a tiny z-extent; of the two
// halves, the one whose finger ring reaches further in +x is the "right" one.
const screw = list.find((c) => c.max[2] - c.min[2] < 0.3);
const halves = list.filter((c) => c !== screw);
halves.sort((a, b) => b.max[0] - a.max[0]);
const [right, left] = halves;

const order = [
  ["right", right],
  ["left", left],
  ["screw", screw],
];

// Rewrite the index buffer in [right | left | screw] order.
const { byteOffset: idxByteOffset, componentSize } = accessorInfo(prim.indices);
const out = Buffer.from(buf);
let write = 0;
const ranges = {};
for (const [name, comp] of order) {
  const start = write;
  for (const t of comp.tris) {
    for (let k = 0; k < 3; k++) {
      const value = indices[t + k];
      if (componentSize === 2) {
        out.writeUInt16LE(value, idxByteOffset + (write + k) * 2);
      } else {
        out.writeUInt32LE(value, idxByteOffset + (write + k) * 4);
      }
    }
    write += 3;
  }
  ranges[name] = { start, count: write - start };
}

writeFileSync(DST, out);

const pivot = [
  (screw.min[0] + screw.max[0]) / 2,
  (screw.min[1] + screw.max[1]) / 2,
  (screw.min[2] + screw.max[2]) / 2,
];
console.log("wrote", DST);
console.log("index ranges", JSON.stringify(ranges, null, 2));
console.log(
  "pivot (screw center)",
  pivot.map((v) => v.toFixed(4)).join(", ")
);
