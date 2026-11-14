// Platform marks drawn as simple monochrome glyphs (lucide-react does not ship brand icons).
type P = { className?: string; title?: string };

function Svg({ className, title, children, viewBox = "0 0 24 24" }: P & { children: React.ReactNode; viewBox?: string }) {
  return (
    <svg viewBox={viewBox} className={className} fill="currentColor" role={title ? "img" : undefined} aria-hidden={title ? undefined : true}>
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}

export function DiscordIcon(p: P) {
  return (
    <Svg {...p}>
      <path d="M20.3 4.4A19.6 19.6 0 0 0 15.4 3l-.6 1.3a18.2 18.2 0 0 0-5.6 0L8.6 3a19.5 19.5 0 0 0-4.9 1.5C.6 9.1-.3 13.6.1 18.1a19.8 19.8 0 0 0 6 3l1.3-2.1a12.8 12.8 0 0 1-2-1l.5-.4a14 14 0 0 0 12.2 0l.5.4c-.7.4-1.3.7-2 1l1.3 2.1a19.7 19.7 0 0 0 6-3c.5-5.2-.8-9.7-3.6-13.7ZM8 15.3c-1.2 0-2.2-1.1-2.2-2.4S6.8 10.5 8 10.5s2.2 1.1 2.2 2.4-1 2.4-2.2 2.4Zm8 0c-1.2 0-2.2-1.1-2.2-2.4s1-2.4 2.2-2.4 2.2 1.1 2.2 2.4-1 2.4-2.2 2.4Z" />
    </Svg>
  );
}

export function RobloxIcon(p: P) {
  return (
    <Svg {...p}>
      <path d="M5.2 1 1 18.8 18.8 23 23 5.2 5.2 1Zm9.1 14.5-4.8-1.1 1.1-4.8 4.8 1.1-1.1 4.8Z" />
    </Svg>
  );
}

export function InstagramIcon(p: P) {
  return (
    <Svg {...p}>
      <path d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4ZM17.3 5.5a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4Z" />
      <path d="M16.6 1H7.4A6.4 6.4 0 0 0 1 7.4v9.2A6.4 6.4 0 0 0 7.4 23h9.2a6.4 6.4 0 0 0 6.4-6.4V7.4A6.4 6.4 0 0 0 16.6 1Zm4.5 15.6a4.5 4.5 0 0 1-4.5 4.5H7.4a4.5 4.5 0 0 1-4.5-4.5V7.4a4.5 4.5 0 0 1 4.5-4.5h9.2a4.5 4.5 0 0 1 4.5 4.5v9.2Z" />
    </Svg>
  );
}

export function TikTokIcon(p: P) {
  return (
    <Svg {...p}>
      <path d="M16.6 1h-3.7v14.6a3.1 3.1 0 1 1-3.1-3.1c.3 0 .6 0 .9.1V8.9a6.9 6.9 0 1 0 6 6.8V8.4a8.5 8.5 0 0 0 4.9 1.6V6.3A4.9 4.9 0 0 1 16.6 1Z" />
    </Svg>
  );
}

export function WikiIcon(p: P) {
  return (
    <Svg {...p}>
      <path d="M3 3h18v2H3zM3 19h18v2H3zM5 7h2v10H5zM11 7h2v10h-2zM17 7h2v10h-2z" />
    </Svg>
  );
}

export function PlatformIcon({ platform, className }: { platform: string; className?: string }) {
  switch (platform) {
    case "Discord":
      return <DiscordIcon className={className} />;
    case "Roblox":
      return <RobloxIcon className={className} />;
    case "Instagram":
      return <InstagramIcon className={className} />;
    case "TikTok":
      return <TikTokIcon className={className} />;
    default:
      return <WikiIcon className={className} />;
  }
}
