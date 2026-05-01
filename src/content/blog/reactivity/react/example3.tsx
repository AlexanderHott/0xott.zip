import { Suspense, use, useCallback, useState, useTransition } from "react";

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(() => resolve(ms), ms));
}

async function divide(a: number, b: number) {
  await sleep(200 + Math.random() * 1000);
  return a / b;
}

async function divideLoader(n: number) {
  return {
    data: await divide(n, 5),
    n,
  };
}
type DivideResult = Awaited<ReturnType<typeof divideLoader>>;

export function ReactExample3() {
  const [n, setN] = useState(0);
  const [isPending, startTransition] = useTransition();
  const [promise, setPromise] = useState(() => divideLoader(n));

  const incrementAction = () => {
    const newN = n + 1;
    setN(newN);

    startTransition(() => {
      setPromise(divideLoader(newN));
    });
  };

  return (
    <div>
      <div>n = {n}</div>
      <button type="button" onClick={incrementAction}>
        Increment
      </button>
      <Suspense fallback={<div>loading...</div>}>
        <Data promise={promise} isPending={isPending} />
      </Suspense>
    </div>
  );
}

function Data(props: { promise: Promise<DivideResult>; isPending: boolean }) {
  const result = use(props.promise);
  return (
    <div style={{ opacity: props.isPending ? 0.8 : 1 }}>
      {result.n} / 5 = {result.data.toFixed(3)}
    </div>
  );
}
