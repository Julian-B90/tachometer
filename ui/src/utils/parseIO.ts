const UNITS: Record<string, number> = {
  B: 1,
  kB: 1024,
  MB: 1024 ** 2,
  GB: 1024 ** 3,
  TB: 1024 ** 4,
  KiB: 1024,
  MiB: 1024 ** 2,
  GiB: 1024 ** 3,
  TiB: 1024 ** 4,
};

function parseSize(value: string): number {
  const trimmed = value.trim();
  const match = trimmed.match(/^([\d.]+)\s*([A-Za-z]+)$/);
  if (!match) return 0;
  const num = parseFloat(match[1]);
  const unit = match[2];
  return num * (UNITS[unit] ?? 1);
}

export function parseIOPair(io: string): { rx: number; tx: number } {
  const parts = io.split("/");
  return {
    rx: parseSize(parts[0] ?? "0"),
    tx: parseSize(parts[1] ?? "0"),
  };
}
