import type { SVGProps } from "react";

/** أيقونات المرافق والأنواع — مكافئ theme/app_icons.dart */

type P = SVGProps<SVGSVGElement>;

const S = (props: P) => ({
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  ...props,
});

export const IconPool = (p: P) => (
  <svg {...S(p)}><path d="M2 17c1.5 0 1.5 1.2 3 1.2s1.5-1.2 3-1.2 1.5 1.2 3 1.2 1.5-1.2 3-1.2 1.5 1.2 3 1.2 1.5-1.2 3-1.2" /><path d="M7 15V6a2 2 0 1 1 4 0M13 15V6a2 2 0 1 1 4 0" /><path d="M7 10h4M13 10h4" /></svg>
);
export const IconWaves = (p: P) => (
  <svg {...S(p)}><path d="M2 8c1.5 0 1.5 1.2 3 1.2S6.5 8 8 8s1.5 1.2 3 1.2S12.5 8 14 8s1.5 1.2 3 1.2S18.5 8 20 8" /><path d="M2 13c1.5 0 1.5 1.2 3 1.2s1.5-1.2 3-1.2 1.5 1.2 3 1.2 1.5-1.2 3-1.2 1.5 1.2 3 1.2 1.5-1.2 3-1.2" /><path d="M2 18c1.5 0 1.5 1.2 3 1.2s1.5-1.2 3-1.2 1.5 1.2 3 1.2 1.5-1.2 3-1.2 1.5 1.2 3 1.2 1.5-1.2 3-1.2" /></svg>
);
export const IconJacuzzi = (p: P) => (
  <svg {...S(p)}><path d="M3 12h18v4a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-4Z" /><path d="M7 12V7a2 2 0 0 1 4 0" /><path d="M14 6.5c0-1 1-1 1-2M17 6.5c0-1 1-1 1-2" /></svg>
);
export const IconAc = (p: P) => (
  <svg {...S(p)}><path d="M12 3v18M4.2 7.5l15.6 9M19.8 7.5l-15.6 9" /><path d="M12 6.5 10 5m2 1.5L14 5M12 17.5 10 19m2-1.5L14 19" /></svg>
);
export const IconWifi = (p: P) => (
  <svg {...S(p)}><path d="M2.5 9a15 15 0 0 1 19 0M6 12.5a10 10 0 0 1 12 0M9.5 16a5 5 0 0 1 5 0" /><circle cx="12" cy="19.5" r=".9" fill="currentColor" stroke="none" /></svg>
);
export const IconBbq = (p: P) => (
  <svg {...S(p)}><path d="M4 6h16l-2.2 7.5a4 4 0 0 1-3.8 2.9h-4A4 4 0 0 1 6.2 13.5L4 6Z" /><path d="M9 16.5 7.5 21M15 16.5 16.5 21" /></svg>
);
export const IconPlayground = (p: P) => (
  <svg {...S(p)}><circle cx="12" cy="12" r="8.5" /><path d="M12 3.5c-3 2.6-3 14.4 0 17M12 3.5c3 2.6 3 14.4 0 17M3.6 9.5h16.8M3.6 14.5h16.8" /></svg>
);
export const IconGames = (p: P) => (
  <svg {...S(p)}><rect x="2.5" y="7" width="19" height="10" rx="4" /><path d="M7 10.5v3M5.5 12h3" /><circle cx="16" cy="11.5" r=".9" fill="currentColor" stroke="none" /><circle cx="18" cy="13.8" r=".9" fill="currentColor" stroke="none" /></svg>
);
export const IconParking = (p: P) => (
  <svg {...S(p)}><rect x="3.5" y="3.5" width="17" height="17" rx="4" /><path d="M10 16.5v-9h2.8a2.6 2.6 0 0 1 0 5.2H10" /></svg>
);
export const IconShield = (p: P) => (
  <svg {...S(p)}><path d="M12 3 5 5.8v5.4c0 4 2.9 7.7 7 9.3 4.1-1.6 7-5.3 7-9.3V5.8L12 3Z" /><path d="m9.2 12 2 2 3.6-3.8" /></svg>
);

export const IconFamily = (p: P) => (
  <svg {...S(p)}><circle cx="8" cy="6.5" r="2.3" /><circle cx="16.5" cy="7.5" r="1.8" /><path d="M4 20v-4a4 4 0 0 1 8 0v4M14 20v-3.2a3.2 3.2 0 0 1 6.4 0V20" /></svg>
);
export const IconYouth = (p: P) => (
  <svg {...S(p)}><rect x="2.5" y="7" width="19" height="10" rx="4" /><path d="M7 10.5v3M5.5 12h3" /><circle cx="16" cy="11.5" r=".9" fill="currentColor" stroke="none" /><circle cx="18" cy="13.8" r=".9" fill="currentColor" stroke="none" /></svg>
);
export const IconEvents = (p: P) => (
  <svg {...S(p)}><path d="m3 21 5.5-12L15 15.5 3 21Z" /><path d="M14 3v2M18.5 4.5 17 6M21 9h-2M19.5 13.5 18 12" /></svg>
);

export const IconLocation = (p: P) => (
  <svg {...S(p)}><path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" /><circle cx="12" cy="10" r="2.6" /></svg>
);
export const IconGuests = (p: P) => (
  <svg {...S(p)}><circle cx="9" cy="8" r="3" /><path d="M3 20v-1.5A4.5 4.5 0 0 1 7.5 14h3A4.5 4.5 0 0 1 15 18.5V20" /><path d="M16 5.2a3 3 0 0 1 0 5.6M18 14.2a4 4 0 0 1 3 3.8V20" /></svg>
);
export const IconHeart = ({ filled, ...p }: P & { filled?: boolean }) => (
  <svg {...S(p)} fill={filled ? "currentColor" : "none"}>
    <path d="M12 20s-7.5-4.6-7.5-9.6A4.4 4.4 0 0 1 12 7.4a4.4 4.4 0 0 1 7.5 3C19.5 15.4 12 20 12 20Z" />
  </svg>
);
export const IconStar = ({ filled, ...p }: P & { filled?: boolean }) => (
  <svg {...S(p)} fill={filled ? "currentColor" : "none"}>
    <path d="m12 4 2.4 5.1 5.6.7-4.1 3.9 1 5.6L12 16.6 6.9 19.3l1-5.6-4.1-3.9 5.6-.7L12 4Z" strokeLinejoin="round" />
  </svg>
);
export const IconVerified = (p: P) => (
  <svg {...S(p)}>
    <path d="m9.5 4 2.5-1.6L14.5 4l2.9-.5 1 2.8 2.6 1.4-.5 2.9 1.5 2.4-1.5 2.4.5 2.9-2.6 1.4-1 2.8-2.9-.5-2.5 1.6L9.5 20l-2.9.5-1-2.8-2.6-1.4.5-2.9L2 12l1.5-2.4-.5-2.9 2.6-1.4 1-2.8L9.5 4Z" />
    <path d="m8.5 12.3 2.2 2.2 4.3-4.6" strokeLinejoin="round" />
  </svg>
);
export const IconSearch = (p: P) => (
  <svg {...S(p)}><circle cx="11" cy="11" r="7" /><path d="m16.5 16.5 4 4" /></svg>
);
export const IconCalendar = (p: P) => (
  <svg {...S(p)}><rect x="3.5" y="5" width="17" height="16" rx="3" /><path d="M3.5 10h17M8 3v4M16 3v4" /></svg>
);
export const IconCheck = (p: P) => (
  <svg {...S(p)}><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
);
export const IconWarn = (p: P) => (
  <svg {...S(p)}><circle cx="12" cy="12" r="9" /><path d="M12 7.5v5.5M12 16.3v.2" /></svg>
);
export const IconGlobe = (p: P) => (
  <svg {...S(p)}><circle cx="12" cy="12" r="8.5" /><path d="M3.6 9.5h16.8M3.6 14.5h16.8M12 3.5c-2.6 2.6-2.6 14.4 0 17M12 3.5c2.6 2.6 2.6 14.4 0 17" /></svg>
);
export const IconUser = (p: P) => (
  <svg {...S(p)}><circle cx="12" cy="8" r="3.4" /><path d="M5 20v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1" /></svg>
);
export const IconChat = (p: P) => (
  <svg {...S(p)}><path d="M20 15a3 3 0 0 1-3 3H8l-4 3V6a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v9Z" /></svg>
);
export const IconMap = (p: P) => (
  <svg {...S(p)}><path d="m3 6.5 6-2.5 6 2.5 6-2.5v13.5l-6 2.5-6-2.5-6 2.5V6.5Z" /><path d="M9 4v13.5M15 6.5V20" /></svg>
);
export const IconNav = (p: P) => (
  <svg {...S(p)}><path d="m3.5 11 17-7.5-7.5 17-2-7.5-7.5-2Z" /></svg>
);
export const IconCash = (p: P) => (
  <svg {...S(p)}><rect x="2.5" y="6" width="19" height="12" rx="3" /><circle cx="12" cy="12" r="2.6" /><path d="M6 10v4M18 10v4" /></svg>
);
export const IconCard = (p: P) => (
  <svg {...S(p)}><rect x="2.5" y="5" width="19" height="14" rx="3" /><path d="M2.5 10h19M6.5 15h3" /></svg>
);
export const IconPhone = (p: P) => (
  <svg {...S(p)}><path d="M5.5 3.5h3l1.5 4-2 1.5a12 12 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2C9.8 19 5 14.2 3.5 5.7A2 2 0 0 1 5.5 3.5Z" /></svg>
);
export const IconMail = (p: P) => (
  <svg {...S(p)}><rect x="2.5" y="4.5" width="19" height="15" rx="3" /><path d="m3.5 6 8.5 7 8.5-7" /></svg>
);
export const IconExternalLink = (p: P) => (
  <svg {...S(p)}><path d="M9 6H5.5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V15" /><path d="M14 4h6v6M20 4l-9.5 9.5" /></svg>
);

const AMENITY_ICONS: Record<string, (p: P) => React.JSX.Element> = {
  private_pool: IconPool,
  shared_pool: IconWaves,
  jacuzzi: IconJacuzzi,
  ac: IconAc,
  wifi: IconWifi,
  bbq: IconBbq,
  playground: IconPlayground,
  games_room: IconGames,
  parking: IconParking,
  security: IconShield,
};

const TYPE_ICONS: Record<string, (p: P) => React.JSX.Element> = {
  family: IconFamily,
  youth: IconYouth,
  events: IconEvents,
};

export function AmenityIcon({ name, ...p }: P & { name: string }) {
  const C = AMENITY_ICONS[name] ?? IconCheck;
  return <C {...p} />;
}

export function TypeIcon({ name, ...p }: P & { name: string }) {
  const C = TYPE_ICONS[name] ?? IconFamily;
  return <C {...p} />;
}
