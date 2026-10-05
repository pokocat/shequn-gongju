// Shared avatar pool — 20 real portrait photos from Unsplash
export const AVATARS = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?w=200&h=200&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1624395213043-fa2e123b2656?w=200&h=200&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1600481176431-47ad2ab2745d?w=200&h=200&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=200&h=200&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1657830582172-b1eb2880f497?w=200&h=200&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1543132220-3ec99c6094dc?w=200&h=200&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1695757002354-8bca71d087c7?w=200&h=200&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1625389833948-11501a6d9b25?w=200&h=200&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1758600587815-b654d1405e83?w=200&h=200&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1720501828093-c792c10e3f0b?w=200&h=200&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1668876220458-805bc60d6046?w=200&h=200&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1681097561932-36d0df02b379?w=200&h=200&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1758600587683-d86675a2f6e9?w=200&h=200&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1581065178047-8ee15951ede6?w=200&h=200&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1758600587839-56ba05596c69?w=200&h=200&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1544168190-79c17527004f?w=200&h=200&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1520689728498-7dd1a9814607?w=200&h=200&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1779878070528-807347e8451f?w=200&h=200&fit=crop&crop=faces",
];

export function getAvatar(idx: number): string {
  return AVATARS[Math.abs(idx) % AVATARS.length];
}

export function Avatar({
  index,
  size = 32,
  radius = "50%",
  style,
}: {
  index: number;
  size?: number;
  radius?: string;
  style?: React.CSSProperties;
}) {
  return (
    <img
      src={getAvatar(index)}
      alt="avatar"
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        objectFit: "cover",
        flexShrink: 0,
        display: "block",
        ...style,
      }}
    />
  );
}
