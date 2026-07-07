import { useEffect, useRef, useState } from "react";
import { CirclePlay } from "lucide-react";
import "./App.css";
import Socials from "./components/socials";

const ROWS = 4;
const COLS = 8;
const GAP = 10;
const ANIM_MS = 300;
const TOTAL = ROWS * COLS;

const figures = Array.from({ length: TOTAL }, (_, i) => `/images/${i + 1}.png`);

function imageAt(logicalRow: number, logicalCol: number): string {
  const seed = (((logicalRow * COLS + logicalCol) % TOTAL) + TOTAL) % TOTAL;
  return figures[seed];
}

const EASE = "cubic-bezier(0.05, 0.7, 0.1, 1)";

function getCardSize(width: number): number {
  if (width < 480) return 78;
  if (width < 768) return 100;
  return 150;
}

function useCardSize() {
  const [cardSize, setCardSize] = useState(() =>
    typeof window !== "undefined" ? getCardSize(window.innerWidth) : 150,
  );

  useEffect(() => {
    function handleResize() {
      setCardSize(getCardSize(window.innerWidth));
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return cardSize;
}

export default function App() {
  const cardSize = useCardSize();
  const CARD_W = cardSize;
  const CARD_H = cardSize;
  const STEP_X = CARD_W + GAP;
  const STEP_Y = CARD_H + GAP;

  const [rowSteps, setRowSteps] = useState<number[]>(Array(ROWS).fill(0));
  const [colSteps, setColSteps] = useState<number[]>(Array(COLS).fill(0));

  const [autoOn, setAutoOn] = useState(true);
  // const [log, setLog] = useState("Auto playing...");
  const busyRef = useRef(false);

  const rowRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const colCellRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const colGhostRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const stageH = ROWS * STEP_Y - GAP;

  function shiftRow(r: number, dir: 1 | -1) {
    if (busyRef.current) return;
    busyRef.current = true;
    // setLog(`Row ${r + 1} → ${dir === 1 ? "right ▶" : "◀ left"}`);

    setRowSteps((prev) => {
      const n = [...prev];
      n[r] += dir;
      return n;
    });

    const el = rowRefs.current.get(r);
    if (!el) {
      busyRef.current = false;
      return;
    }

    const anim = el.animate(
      [
        { transform: `translateX(${-dir * STEP_X}px)` },
        { transform: "translateX(0)" },
      ],
      { duration: ANIM_MS, easing: EASE, fill: "forwards" },
    );

    anim.finished
      .then(() => {
        busyRef.current = false;
      })
      .catch(() => {
        busyRef.current = false;
      });
  }

  function shiftCol(c: number, dir: 1 | -1) {
    if (busyRef.current) return;
    busyRef.current = true;
    // setLog(`Col ${c + 1} → ${dir === 1 ? "down ▼" : "▲ up"}`);

    setColSteps((prev) => {
      const n = [...prev];
      n[c] += dir;
      return n;
    });

    const els: HTMLDivElement[] = [];
    for (let r = 0; r < ROWS; r++) {
      const el = colCellRefs.current.get(`${r}-${c}`);
      if (el) els.push(el);
    }
    const topGhost = colGhostRefs.current.get(`${c}--1`);
    const bottomGhost = colGhostRefs.current.get(`${c}-${ROWS}`);
    if (topGhost) els.push(topGhost);
    if (bottomGhost) els.push(bottomGhost);

    const anims = els.map((el) =>
      el.animate(
        [
          { transform: `translateY(${-dir * STEP_Y}px)` },
          { transform: "translateY(0)" },
        ],
        { duration: ANIM_MS, easing: EASE, fill: "forwards" },
      ),
    );

    Promise.all(anims.map((a) => a.finished))
      .then(() => {
        busyRef.current = false;
      })
      .catch(() => {
        busyRef.current = false;
      });
  }

  function randomStep() {
    if (busyRef.current) return;
    if (Math.random() < 0.6) {
      const r = Math.floor(Math.random() * ROWS);
      shiftRow(r, Math.random() < 0.5 ? 1 : -1);
    } else {
      const c = Math.floor(Math.random() * COLS);
      shiftCol(c, Math.random() < 0.5 ? 1 : -1);
    }
  }

  function reset() {
    busyRef.current = false;
    setRowSteps(Array(ROWS).fill(0));
    setColSteps(Array(COLS).fill(0));
    // setLog("Reset.");
  }

  useEffect(() => {
    if (!autoOn) return;
    const id = setInterval(randomStep, ANIM_MS + 600);
    return () => clearInterval(id);
  }, [autoOn]);

  return (
    <main className="h-screen w-full flex flex-col gap-2">
      <div className="border-b border-black/24 flex flex-col gap-4 md:flex-row items-end mt-4">
        <h1 className="font-penScript whitespace-nowrap text-2xl px-4">
          My Fashion Runway
        </h1>
        <Socials />
      </div>

      <div className="h-full w-full flex flex-col  gap-10 ">
        <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-5 mt-5 px-4">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={randomStep}
              className="flex items-center gap-1 rounded-full py-1 px-3 text-xs font-semibold border bg-black hover:bg-transparent text-white hover:text-black shadow-md shadow-black transition-all cursor-pointer"
            >
              <CirclePlay size={15} /> Random
            </button>
            <button
              onClick={() => setAutoOn((a) => !a)}
              className="flex items-center gap-1 rounded-full py-1 px-3 text-xs font-semibold border  bg-blue-900 hover:bg-blue-50 text-white hover:text-blue-400  shadow-md shadow-blue-950 transition-all cursor-pointer"
            >
              <CirclePlay size={15} /> {autoOn ? "Stop Auto" : "Auto Play"}
            </button>
            <button
              onClick={reset}
              className="flex items-center gap-2 rounded-full py-1 px-4 text-xs font-semibold border bg-red-900 text-white hover:bg-red-50 hover:text-red-400 shadow-md shadow-red-950  transition-all cursor-pointer"
            >
              <CirclePlay size={15} /> Reset
            </button>
          </div>
          {/* <p className="text-xs italic hidden sm:block">{log}</p> */}
        </div>

        <div
          className="mx-auto w-[95%] sm:max-w-6xl rounded-md bg-white border border-gray-100 "
          style={{ overflow: "hidden" }}
        >
          <div
            className="relative my-4"
            style={{ height: stageH, overflow: "hidden" }}
          >
            {Array.from({ length: ROWS }, (_, r) => {
              const stripCards = Array.from({ length: COLS + 2 }, (_, i) => {
                const slot = i - 1;
                const isRealCol = slot >= 0 && slot < COLS;
                const logicalCol = slot - rowSteps[r];
                const logicalRow = r - colSteps[isRealCol ? slot : 0];
                const src = imageAt(logicalRow, logicalCol);

                return (
                  <div
                    key={`cell-r${r}-slot${slot}`}
                    ref={(el) => {
                      if (isRealCol) {
                        if (el) colCellRefs.current.set(`${r}-${slot}`, el);
                        else colCellRefs.current.delete(`${r}-${slot}`);
                      }
                    }}
                    style={{ width: CARD_W, height: CARD_H, flexShrink: 0 }}
                  >
                    <img
                      src={src}
                      alt=""
                      className="w-full h-full object-contain"
                      draggable={false}
                    />
                  </div>
                );
              });

              return (
                <div
                  key={`row-${r}`}
                  ref={(el) => {
                    if (el) rowRefs.current.set(r, el);
                    else rowRefs.current.delete(r);
                  }}
                  style={{
                    position: "absolute",
                    top: r * STEP_Y,
                    left: -STEP_X,
                    height: CARD_H,
                    display: "flex",
                    gap: GAP,
                  }}
                >
                  {stripCards}
                </div>
              );
            })}

            {Array.from({ length: COLS }, (_, c) =>
              [-1, ROWS].map((r) => {
                const logicalRow = r - colSteps[c];
                const logicalCol =
                  c - rowSteps[Math.max(0, Math.min(r, ROWS - 1))];
                const src = imageAt(logicalRow, logicalCol);

                return (
                  <div
                    key={`vghost-c${c}-r${r}`}
                    ref={(el) => {
                      if (el) colGhostRefs.current.set(`${c}-${r}`, el);
                      else colGhostRefs.current.delete(`${c}-${r}`);
                    }}
                    style={{
                      position: "absolute",
                      width: CARD_W,
                      height: CARD_H,
                      left: c * STEP_X,
                      top: r * STEP_Y,
                    }}
                  >
                    <img
                      src={src}
                      alt=""
                      className="w-full h-full object-contain"
                      draggable={false}
                    />
                  </div>
                );
              }),
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
