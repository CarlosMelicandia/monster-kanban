import { useEffect, useRef } from "react";

const Teeth = ({ direction, count }) => {
  const vbWidth = count * 20;
  const h = 42;
  const toothH = 30;

  const d = Array.from({ length: count }, (_, i) => {
    const x = i * 20;
    return direction === "down"
      ? `M${x},0 L${x},${h - toothH} Q${x + 10},${h} ${x + 20},${h - toothH} L${x + 20},0 Z`
      : `M${x},${h} L${x},${toothH} Q${x + 10},0 ${x + 20},${toothH} L${x + 20},${h} Z`;
  }).join(" ");

  return (
    <svg
      width="100%"
      height={h}
      viewBox={`0 0 ${vbWidth} ${h}`}
      preserveAspectRatio="none"
      className="block"
    >
      <path d={d} fill="white" />
    </svg>
  );
};

export default function Monster({
  color,
  bodyColor,
  upperTeeth = 5,
  lowerTeeth = 4,
  eyes = { left: "5rem", right: "5rem" },
  children,
}) {
  const eyesRef = useRef([]);
  const pupilsRef = useRef([]);
  const maxMove = 5;

  useEffect(() => {
    const handleMove = (e) => {
      eyesRef.current.forEach((eye, index) => {
        const pupil = pupilsRef.current[index];
        if (!eye || !pupil) return;

        const rect = eye.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dx = e.clientX - centerX;
        const dy = e.clientY - centerY;
        const angle = Math.atan2(dy, dx);
        const x = Math.cos(angle) * maxMove;
        const y = Math.sin(angle) * maxMove;

        pupil.style.transform = `translate(${x}px, ${y}px)`;
      });
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  const setEyeRef = (el) => {
    if (el && !eyesRef.current.includes(el)) eyesRef.current.push(el);
  };

  const setPupilRef = (el) => {
    if (el && !pupilsRef.current.includes(el)) pupilsRef.current.push(el);
  };

  return (
    <div className={`${color} w-full rounded-3xl overflow-hidden shadow-xl flex flex-col`}>
      {/* Monster Head — eyes */}
      <div className="w-full flex justify-center items-end py-6 gap-5">
        {[eyes.left, eyes.right].map((size, i) => (
          <div
            key={i}
            className="relative bg-white rounded-full overflow-hidden flex-shrink-0"
            style={{ width: size, height: size }}
            ref={setEyeRef}
          >
            <div
              ref={setPupilRef}
              className="absolute bg-black rounded-full transition-transform duration-75 ease-linear"
              style={{
                width: "40%",
                height: "40%",
                top: "30%",
                left: "30%",
              }}
            />
          </div>
        ))}
      </div>

      {/* Mouth */}
      <div className="w-full px-2 pb-3">
        <div className="bg-black/30 rounded-2xl overflow-hidden">
          <Teeth direction="down" count={upperTeeth} />

          <div className={`${bodyColor} mx-2 rounded-xl`}>
            <div className="p-3">{children}</div>
          </div>

          <Teeth direction="up" count={lowerTeeth} />
        </div>
      </div>
    </div>
  );
}
