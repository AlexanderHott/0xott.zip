import { useCallback, useEffect, useState } from "react";

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(() => resolve(ms), ms));
}

async function divide(a: number, b: number) {
  await sleep(200 + Math.random() * 1000);
  return a / b;
}

export function ReactExample2() {
  const [nLatest, setNLatest] = useState(1);
  const increment = useCallback(() => setNLatest((prev) => prev + 1), []);
  const [n, setN] = useState(nLatest);

  const [data, setData] = useState<number | undefined>(undefined);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setIsPending(true);
    divide(nLatest, 5).then((result) => {
      if (cancelled) {
        return;
      }
      setData(result);
      setIsPending(false);
      setN(nLatest);
    });

    return () => {
      cancelled = true;
    };
  }, [nLatest]);

  return (
    <div>
      <div>n = {nLatest}</div>
      <button type="button" onClick={increment}>
        Increment
      </button>
      {data === undefined ? (
        <div>loading...</div>
      ) : (
        <div style={{ opacity: isPending ? 0.5 : 1 }}>
          {n} / 5 = {data.toFixed(3)}
        </div>
      )}
    </div>
  );
}
