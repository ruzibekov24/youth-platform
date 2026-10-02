import Image from "next/image";

// 3D plitka ikonkalar (public/brand/icons). Bezak: ekran o'quvchilardan yashirilgan.
export type TileName =
  | "base" | "calendar" | "check" | "qr" | "bulb" | "cap" | "mic"
  | "team" | "key" | "bookmark" | "medal" | "puzzle" | "shield" | "pin" | "bell";

export function Tile({ name, size, className }: { name: TileName; size: number; className?: string }) {
  return (
    <Image
      src={`/brand/icons/${name}.png`}
      alt=""
      width={size}
      height={size}
      className={className}
      aria-hidden
    />
  );
}
