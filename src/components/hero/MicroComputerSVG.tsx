/* ------------------------------------------------------------------ */
/*  SVG-иллюстрация микрокомпьютера — серый контур с дорожками         */
/* ------------------------------------------------------------------ */

interface MicroComputerSVGProps {
  boardColor?: string;
  chipColor?: string;
  pinColor?: string;
  portColor?: string;
  ledColor?: string;
  traceColor?: string;
}

export function MicroComputerSVG({
  boardColor = "transparent",
  chipColor = "transparent",
  pinColor = "#6b7280",
  portColor = "#6b7280",
  ledColor = "#6b7280",
  traceColor = "#6b7280",
}: MicroComputerSVGProps) {
  const outline = traceColor;

  return (
    <svg
      viewBox="0 0 400 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", maxWidth: 850, height: "auto" }}
    >
      {/* PCB Board outline */}
      <rect
        x="30"
        y="30"
        width="340"
        height="220"
        rx="8"
        fill={boardColor}
        stroke={outline}
        strokeWidth="2"
      />

      {/* PCB traces (decorative lines) */}
      {[60, 90, 120, 150, 180, 210, 240].map((y) => (
        <line
          key={`h-${y}`}
          x1="40"
          y1={y}
          x2="360"
          y2={y}
          stroke={outline}
          strokeWidth="0.8"
          opacity="0.5"
        />
      ))}
      {[70, 100, 130, 160, 190, 220, 250, 280, 310, 340].map((x) => (
        <line
          key={`v-${x}`}
          x1={x}
          y1="40"
          x2={x}
          y2="240"
          stroke={outline}
          strokeWidth="0.8"
          opacity="0.5"
        />
      ))}

      {/* SoC chip outline */}
      <rect
        x="155"
        y="105"
        width="90"
        height="70"
        rx="4"
        fill={chipColor}
        stroke={outline}
        strokeWidth="1.5"
      />
      <text
        x="200"
        y="145"
        textAnchor="middle"
        fill={outline}
        fontSize="10"
        fontFamily="monospace"
        opacity="0.7"
      >
        SoC
      </text>

      {/* RAM chip outline */}
      <rect
        x="60"
        y="115"
        width="55"
        height="50"
        rx="3"
        fill={chipColor}
        stroke={outline}
        strokeWidth="1.5"
      />
      <text
        x="87"
        y="145"
        textAnchor="middle"
        fill={outline}
        fontSize="9"
        fontFamily="monospace"
        opacity="0.7"
      >
        RAM
      </text>

      {/* WiFi chip outline */}
      <rect
        x="280"
        y="160"
        width="40"
        height="35"
        rx="3"
        fill={chipColor}
        stroke={outline}
        strokeWidth="1.5"
      />
      <text
        x="300"
        y="182"
        textAnchor="middle"
        fill={outline}
        fontSize="8"
        fontFamily="monospace"
        opacity="0.7"
      >
        WiFi
      </text>

      {/* USB ports (left edge) */}
      <rect x="22" y="80" width="18" height="30" rx="2" fill={portColor} stroke={outline} strokeWidth="1" />
      <rect x="22" y="130" width="18" height="30" rx="2" fill={portColor} stroke={outline} strokeWidth="1" />

      {/* Ethernet port (left edge) */}
      <rect x="18" y="175" width="24" height="28" rx="2" fill={portColor} stroke={outline} strokeWidth="1" />

      {/* HDMI port (right edge) */}
      <rect x="358" y="100" width="22" height="18" rx="2" fill={portColor} stroke={outline} strokeWidth="1" />

      {/* USB-C power (bottom) */}
      <rect x="185" y="238" width="30" height="12" rx="3" fill={portColor} stroke={outline} strokeWidth="1" />

      {/* GPIO pins (top edge) — row 1 */}
      {Array.from({ length: 20 }, (_, i) => (
        <circle
          key={`gpio1-${i}`}
          cx={115 + i * 9}
          cy="38"
          r="2.5"
          fill="none"
          stroke={pinColor}
          strokeWidth="1.2"
        />
      ))}
      {/* GPIO pins (top edge) — row 2 */}
      {Array.from({ length: 20 }, (_, i) => (
        <circle
          key={`gpio2-${i}`}
          cx={115 + i * 9}
          cy="50"
          r="2.5"
          fill="none"
          stroke={pinColor}
          strokeWidth="1.2"
        />
      ))}

      {/* Capacitors */}
      {[
        [100, 190],
        [250, 80],
        [310, 100],
      ].map(([cx, cy], i) => (
        <rect
          key={`cap-${i}`}
          x={cx - 5}
          y={cy - 5}
          width="10"
          height="10"
          rx="2"
          fill={chipColor}
          stroke={outline}
          strokeWidth="1"
          opacity="0.6"
        />
      ))}

      {/* LED indicator — subtle pulse */}
      <circle cx="340" cy="210" r="5" fill="none" stroke={ledColor} strokeWidth="1.5">
        <animate
          attributeName="stroke-opacity"
          values="1;0.3;1"
          dur="2s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
}
