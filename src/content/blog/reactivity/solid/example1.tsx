/** @jsxImportSource solid-js */
import { createMemo, createSignal } from "solid-js";

function divide(a: number, b: number) {
  return a / b;
}

export function SolidExample1() {
  const [n, setN] = createSignal(1);
  const a = createMemo(() => divide(n(), 5));

  return (
    <div>
      <div>n = {n()}</div>
      <button type="button" onClick={() => setN((prev) => prev + 1)}>
        Increment
      </button>
      <div>
        {n()} / 5 = {a().toFixed(3)}
      </div>
    </div>
  );
}
