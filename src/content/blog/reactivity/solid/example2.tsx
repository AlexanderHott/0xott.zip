/** @jsxImportSource solid-js */
import { createResource, createSignal, Suspense } from "solid-js";

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(() => resolve(ms), ms));
}

async function divide(a: number, b: number) {
  await sleep(200 + Math.random() * 1000);
  return a / b;
}

export function SolidExample2() {
  const [n, setN] = createSignal(1);
  const [data] = createResource(n, async (n) => {
    const result = await divide(n, 5);
    return { result, n };
  });

  return (
    <div>
      <div>n = {n()}</div>
      <button type="button" onClick={() => setN((prev) => prev + 1)}>
        Increment
      </button>
      <Suspense fallback={<div>Loading...</div>}>
        <div style={{ opacity: data.loading ? 0.8 : 1 }}>
          {data.latest?.n} / 5 = {data.latest?.result?.toFixed(3)}
        </div>
      </Suspense>
    </div>
  );
}
