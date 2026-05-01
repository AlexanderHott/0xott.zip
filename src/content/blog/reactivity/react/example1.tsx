import { useCallback, useState } from "react";

function divide(a: number, b: number) {
  return a / b;
}

export function ReactExample1() {
  const [n, setN] = useState(1);

  // const increment = useCallback(() => setN(n + 1), [n, setN]);
  const increment = useCallback(() => setN((prev) => prev + 1), [setN]);

  return (
    <div>
      <div>n = {n}</div>
      <button type="button" onClick={increment}>
        Increment
      </button>
      <div>
        {n} / 1 = {divide(n, 1).toFixed(3)}
      </div>
      <div>
        {n} / 2 = {divide(n, 2).toFixed(3)}
      </div>
      <div>
        {n} / 3 = {divide(n, 3).toFixed(3)}
      </div>
      <div>
        {n} / 4 = {divide(n, 4).toFixed(3)}
      </div>
      <div>
        {n} / 5 = {divide(n, 5).toFixed(3)}
      </div>
    </div>
  );
}
