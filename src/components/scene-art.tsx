/**
 * فن تجريدي بديل للصور — مشهد مبسّط بألوان النظام (توكنات فقط، بدون hex ثابت).
 * بيتغيّر حسب نوع الشاليه (عائلي/شبابي/مناسبات) ومعرّفه، عشان الكروت ما تتكرر بنفس الشكل.
 * بينحذف لما نربط صور حقيقية من الـ API.
 */

/** هاش بسيط وحتمي من نص لرقم 0..1 — لتنويع المشهد حسب معرّف الشاليه */
function seedFrac(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) h = (h * 31 + input.charCodeAt(i)) >>> 0;
  return (h % 997) / 997;
}

function quadPoint(p0: [number, number], p1: [number, number], p2: [number, number], t: number) {
  const x = (1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * p1[0] + t ** 2 * p2[0];
  const y = (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * p1[1] + t ** 2 * p2[1];
  return [x, y] as const;
}

interface SceneProps {
  t: number;
  t2: number;
}

/** مشهد عائلي — مسبح نهاري + نخلة، لأيام هادية بالعائلة */
function FamilyScene({ t, t2 }: SceneProps) {
  const sunCx = 40 + t * 320;
  const sunCy = 44 + t2 * 20;
  const palmRight = t > 0.5;
  const palmX = palmRight ? 350 : 50;

  return (
    <>
      <rect width="400" height="300" className="fill-teal-light" />
      <circle cx={sunCx} cy={sunCy} r={26} className="fill-sand" fillOpacity={0.85} />
      <path
        d={`M0,${150 + t * 25} Q100,${120 + t * 15} 200,${140} T400,${132} V300 H0 Z`}
        className="fill-teal" fillOpacity={0.14}
      />
      <path
        d={`M0,${190 + t2 * 20} Q120,${160 + t2 * 15} 240,${180} T400,${172} V300 H0 Z`}
        className="fill-teal" fillOpacity={0.26}
      />
      <rect x="0" y="258" width="400" height="42" className="fill-type-card" />
      <rect x="30" y="186" width="340" height="60" rx="30" className="fill-white" fillOpacity={0.88} />
      <line x1="55" y1="216" x2="345" y2="216" className="stroke-teal" strokeOpacity={0.35} strokeWidth={1.4} />
      <line x1="90" y1="228" x2="310" y2="228" className="stroke-teal" strokeOpacity={0.22} strokeWidth={1.4} />
      <g className="stroke-teal" strokeWidth={3} fill="none">
        <line x1={palmX} y1={186} x2={palmX + (palmRight ? -6 : 6)} y2={126} />
      </g>
      <g className="fill-teal">
        <ellipse cx={palmX + (palmRight ? -18 : 18)} cy={118} rx={20} ry={8} transform={`rotate(${palmRight ? 20 : -20} ${palmX} 126)`} />
        <ellipse cx={palmX} cy={110} rx={20} ry={8} />
        <ellipse cx={palmX + (palmRight ? 18 : -18)} cy={118} rx={20} ry={8} transform={`rotate(${palmRight ? -20 : 20} ${palmX} 126)`} />
      </g>
    </>
  );
}

/** مشهد شبابي — سهرة مسائية وأضواء معلّقة */
function YouthScene({ t, t2 }: SceneProps) {
  const moonCx = 60 + t * 80;
  const midCtrl: [number, number] = [200, 30 + t2 * 26];

  return (
    <>
      <defs>
        <linearGradient id="youth-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" className="[stop-color:var(--color-teal-light)]" />
          <stop offset="1" className="[stop-color:var(--color-teal)]" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill="url(#youth-sky)" />
      <circle cx={moonCx} cy={60} r={20} className="fill-white" fillOpacity={0.9} />
      <circle cx={moonCx} cy={60} r={30} className="fill-white" fillOpacity={0.18} />
      <path
        d={`M20,96 Q${midCtrl[0]},${midCtrl[1]} 380,96`}
        className="stroke-sand" strokeOpacity={0.7} strokeWidth={1.6} fill="none"
      />
      {Array.from({ length: 7 }).map((_, i) => {
        const [x, y] = quadPoint([20, 96], midCtrl, [380, 96], i / 6);
        return <circle key={i} cx={x} cy={y + 3} r={3} className="fill-sand" />;
      })}
      <path
        d={`M0,${210 + t * 15} Q140,${190 + t2 * 10} 400,${205} V300 H0 Z`}
        className="fill-teal" fillOpacity={0.5}
      />
      <rect x="0" y="252" width="400" height="48" className="fill-teal" fillOpacity={0.85} />
    </>
  );
}

/** مشهد مناسبات — خيمة وأعلام لعصر ذهبي */
function EventsScene({ t, t2 }: SceneProps) {
  const baseX = 120 + t2 * 60;

  return (
    <>
      <rect width="400" height="300" className="fill-sand" fillOpacity={0.16} />
      <circle cx={80 + t * 220} cy={165} r={58} className="fill-sand" fillOpacity={0.4} />
      <path
        d={`M0,${210 + t2 * 12} Q160,${190} 400,${205} V300 H0 Z`}
        className="fill-teal" fillOpacity={0.14}
      />
      <rect x="0" y="258" width="400" height="42" className="fill-type-card" />
      <path
        d={`M${baseX},255 L${baseX + 70},110 L${baseX + 140},255 Z`}
        className="fill-white" fillOpacity={0.92}
      />
      <path
        d={`M${baseX},255 L${baseX + 70},110 L${baseX + 140},255 Z`}
        className="stroke-teal" strokeOpacity={0.4} strokeWidth={1.4} fill="none"
      />
      {[baseX - 34, baseX + 176].map((fx, i) => (
        <g key={i}>
          <line x1={fx} y1={255} x2={fx} y2={150} className="stroke-teal" strokeWidth={2} />
          <path d={`M${fx},150 L${fx + 22},158 L${fx},166 Z`} className="fill-sand" />
        </g>
      ))}
    </>
  );
}

export function SceneArt({
  seed,
  typeKey,
  className = "",
  label,
}: {
  seed: string;
  typeKey: string;
  className?: string;
  label?: string;
}) {
  const t = seedFrac(seed);
  const t2 = seedFrac(`${seed}-2`);

  const Scene = typeKey === "youth" ? YouthScene : typeKey === "events" ? EventsScene : FamilyScene;

  return (
    <div className={`relative overflow-hidden ${className}`} role="img" aria-label={label ?? ""}>
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
        <Scene t={t} t2={t2} />
      </svg>
    </div>
  );
}
