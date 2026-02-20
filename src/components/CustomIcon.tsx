interface SparkleProps {
  cx: number;
  cy: number;
  r: number;
}

function Sparkle({ cx, cy, r }: SparkleProps) {
  const d = [
    `M ${cx} ${cy - r}`,
    `Q ${cx} ${cy} ${cx + r} ${cy}`,
    `Q ${cx} ${cy} ${cx} ${cy + r}`,
    `Q ${cx} ${cy} ${cx - r} ${cy}`,
    `Q ${cx} ${cy} ${cx} ${cy - r}`,
    'Z',
  ].join(' ');

  return <path d={d} />;
}

export default function CustomIcon() {
  return (
    <div className="w-[52px] h-[62px] flex-shrink-0" role="img" aria-label="rePROMPTer logo">
      <svg viewBox="0 0 100 120" className="w-full h-full" aria-hidden="true">
        <defs>
          <linearGradient
            id="iconGrad"
            x1="0"
            y1="0"
            x2="100"
            y2="100"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FF4D5A" />
            <stop offset="1" stopColor="#8B0000" />
          </linearGradient>
        </defs>

        <g fill="url(#iconGrad)">
          <Sparkle cx={65} cy={40} r={32} />
          <Sparkle cx={28} cy={22} r={18} />
          <Sparkle cx={32} cy={72} r={14} />
        </g>

        <text
          textAnchor="middle"
          fontWeight="900"
          fontFamily="system-ui, -apple-system, sans-serif"
          letterSpacing="0.02em"
        >
          <tspan x="22" y="115" fontSize="24" fill="#E0E0E0">
            RE
          </tspan>
          <tspan x="50" y="115" fontSize="36" fill="url(#iconGrad)">
            P
          </tspan>
          <tspan x="78" y="115" fontSize="24" fill="#E0E0E0">
            ER
          </tspan>
        </text>
      </svg>
    </div>
  );
}
