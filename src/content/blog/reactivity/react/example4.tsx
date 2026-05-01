import {
  Suspense,
  use,
  useState,
  useTransition,
  startTransition,
  useOptimistic,
  useRef,
} from "react";

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(() => resolve(ms), ms));
}

async function divide(a: number, b: number) {
  await sleep(200 + Math.random() * 1000);
  return a / b;
}

export function ReactExample4() {
  return (
    <div>
      <Tearing />
      <BailOut />
      <Hold />
      <Optimistic />
    </div>
  );
}

function Tearing() {
  const [n, setN] = useState(1);
  const [promise, setPromise] = useState(() => divide(n, 5));
  const incrementAction = () => {
    const newN = n + 1;
    setN(newN);
    startTransition(() => {
      setPromise(divide(newN, 5));
    });
  };

  return (
    <div>
      <p>Tearing: Update sync state now, update async state later</p>
      <div>n = {n}</div>
      <button type="button" onClick={incrementAction}>
        increment
      </button>
      <Suspense fallback={<div>loading initial data...</div>}>
        <TearingData promise={promise} n={n} />
      </Suspense>
    </div>
  );
}
function TearingData(props: { promise: Promise<number>; n: number }) {
  const data = use(props.promise);
  return (
    <div>
      {props.n} / 5 = {data.toFixed(3)}
    </div>
  );
}

function BailOut() {
  const [n, setN] = useState(1);
  const [promise, setPromise] = useState(() => divide(n, 5));
  const increment = () => {
    const newN = n + 1;
    setN(newN);
    setPromise(divide(newN, 5));
  };

  return (
    <div>
      <p>Bail Out: show a fallback when the new async data is loading</p>
      <div>n = {n}</div>
      <button type="button" onClick={increment}>
        increment
      </button>
      <Suspense fallback={<div>loading...</div>}>
        <BailOutData promise={promise} n={n} />
      </Suspense>
    </div>
  );
}
function BailOutData(props: { promise: Promise<number>; n: number }) {
  const data = use(props.promise);
  return (
    <div>
      {props.n} / 5 = {data.toFixed(3)}
    </div>
  );
}

function Hold() {
  const [nLatest, setNLatest] = useState(1);
  const [n, setN] = useState(nLatest);
  const [promise, setPromise] = useState(() => divide(nLatest, 5));
  const increment = () => {
    const newN = nLatest + 1;
    setNLatest(newN);
    startTransition(() => {
      setN(newN);
      setPromise(divide(newN, 5));
    });
  };

  return (
    <div>
      <p>
        Hold in the past: show a previous state while the new async data is
        loading
      </p>
      <div>n = {nLatest}</div>
      <button type="button" onClick={increment}>
        increment
      </button>
      <Suspense fallback={<div>loading initial data...</div>}>
        <HoldData promise={promise} n={n} />
      </Suspense>
    </div>
  );
}
function HoldData(props: { promise: Promise<number>; n: number }) {
  const data = use(props.promise);
  return (
    <div>
      {props.n} / 5 = {data.toFixed(3)}
    </div>
  );
}

function Optimistic() {
  const [n, setN] = useState(1);
  const [data, setData] = useState<number>(n / 5);
  const [dataOptimistic, setDataOptimistic] = useOptimistic(data);
  const versionRef = useRef(0);

  const incrementAction = () => {
    const version = ++versionRef.current;
    const newN = n + 1;
    setN(newN);
    startTransition(async () => {
      setDataOptimistic(newN / 5);

      const result = await divide(newN, 5);

      if (version === versionRef.current) {
        startTransition(() => setData(result));
      }
    });
  };

  return (
    <div>
      <p>Optimistic updates: predict the future</p>
      <div>n = {n}</div>
      <button type="button" onClick={incrementAction}>
        increment
      </button>
      <div>
        {n} / 5 = {dataOptimistic.toFixed(3)}
      </div>
      <div style={{ opacity: 0.8 }}>
        {n} / 5 = {data.toFixed(3)}
      </div>
    </div>
  );
}
