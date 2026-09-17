/**
 * VipBadge — 游戏化 VIP 等级徽章（真实图片版）
 *
 * 使用生成的徽章 PNG/JPG 图片，来自 Dribbble 风格参考：
 *   r0 游客 → 灰褐圆形金属奖章
 *   r1 体验官 → 翠绿六边形盾徽 + 小宝石
 *   r2 PRO → 紫色六边形盾徽 + 光晕脉冲
 *   r3 VIP → 金色王冠 + 宝石圆章 + 绶带
 *   r4 黑金 → 黑金王冠 + 血红宝石 + 红绶带
 *
 * 尺寸 size：
 *   "sm" (32px 行内) / "md" (72px 卡片) / "lg" (110px 大展示)
 */

export type VipRarity = 0 | 1 | 2 | 3 | 4;
export type VipSize = "sm" | "md" | "lg";

export interface VipBadgeProps {
  /** 稀有度 0-4 */
  rarity: VipRarity;
  /** 尺寸 */
  size?: VipSize;
  /** 额外 className */
  className?: string;
  /** 是否显示标签文字（图片本身不含文字） */
  showLabel?: boolean;
  /** 标签文字（若 showLabel=true） */
  label?: string;
}

/** rarity → 徽章图片路径映射 */
const BADGE_IMAGES: Record<VipRarity, string> = {
  0: "/badges/transparent/badge-r0-guest.png",
  1: "/badges/transparent/badge-r1-trial.png",
  2: "/badges/transparent/badge-r2-pro.png",
  3: "/badges/transparent/badge-r3-vip.png",
  4: "/badges/transparent/badge-r4-black.png",
};

/** rarity → 显示名 */
export const BADGE_NAMES: Record<VipRarity, string> = {
  0: "游客",
  1: "体验官",
  2: "PRO",
  3: "VIP",
  4: "黑金",
};

/** rarity → 外发光色 */
export const BADGE_GLOW: Record<VipRarity, string> = {
  0: "#8B7355",
  1: "#10B981",
  2: "#7C3AED",
  3: "#F59E0B",
  4: "#DC2626",
};

const SIZE_PX: Record<VipSize, number> = {
  sm: 36,
  md: 72,
  lg: 110,
};

export default function VipBadge({
  rarity,
  size = "md",
  className = "",
  showLabel = true,
  label,
}: VipBadgeProps) {
  const px = SIZE_PX[size];
  const glow = BADGE_GLOW[rarity];
  const src = BADGE_IMAGES[rarity];
  const displayLabel = label ?? BADGE_NAMES[rarity];

  return (
    <span
      className={`vip-badge vip-badge--${size} vip-badge--r${rarity} ${className}`}
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        gap: size === "sm" ? 2 : 4,
        lineHeight: 1,
      }}
    >
      <img
        src={src}
        alt={`VIP ${displayLabel}`}
        width={px}
        height={px}
        draggable={false}
        style={{
          width: px,
          height: "auto",
          display: "block",
          filter: `drop-shadow(0 4px 10px rgba(0,0,0,.18)) drop-shadow(0 0 ${rarity >= 2 ? 8 : 0}px ${glow}44)`,
          transition: "transform .25s ease",
          flexShrink: 0,
        }}
      />
      {showLabel && (
        <span
          style={{
            fontSize: size === "sm" ? 10 : size === "md" ? 12 : 14,
            fontWeight: 700,
            color: glow,
            letterSpacing: "0.5px",
          }}
        >
          {displayLabel}
        </span>
      )}
    </span>
  );
}
