/**
 * Logo — inlines the canonical vertical lockup SVG verbatim from disk.
 * The mark and wordmark are one indivisible asset. Never recompose them in JSX.
 *
 * @example <Logo size="md" />
 */

import fs from "fs";
import path from "path";

type LogoSize = "sm" | "md" | "lg" | "xl";

const widths: Record<LogoSize, number> = {
  sm: 80,
  md: 120,
  lg: 160,
  xl: 240,
};

interface LogoProps {
  size?: LogoSize;
  className?: string;
}

export default function Logo({ size = "md", className }: LogoProps) {
  const svgPath = path.join(
    process.cwd(),
    "public",
    "assets",
    "logo_vertical_transparent.svg"
  );
  const raw = fs.readFileSync(svgPath, "utf-8");

  const w = widths[size];
  const h = Math.round((w * 124) / 160);

  // Adjust dimensions only — every other attribute is canonical and must not change
  const svg = raw
    .replace(/width="[^"]*"/, `width="${w}"`)
    .replace(/height="[^"]*"/, `height="${h}"`);

  return (
    <span
      className={className}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
