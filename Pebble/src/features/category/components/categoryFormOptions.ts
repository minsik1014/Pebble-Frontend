export const CATEGORY_PRESET_COLORS = [
  "#ff7580",
  "#f99d3d",
  "#ffdd47",
  "#60d062",
  "#00cef5",
  "#bf73fd",
] as const;

export const DEFAULT_CATEGORY_COLOR = CATEGORY_PRESET_COLORS[0];

const normalizeHexColor = (color: string) => {
  const trimmedColor = color.trim();

  if (/^#[0-9a-fA-F]{6}$/.test(trimmedColor)) {
    return trimmedColor.toLowerCase();
  }

  if (/^#[0-9a-fA-F]{3}$/.test(trimmedColor)) {
    return `#${trimmedColor
      .slice(1)
      .split("")
      .map((value) => `${value}${value}`)
      .join("")}`.toLowerCase();
  }

  return "#171717";
};

const hexToRgb = (color: string) => {
  const normalizedColor = normalizeHexColor(color).slice(1);
  const value = Number.parseInt(normalizedColor, 16);

  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
};

const rgbToHex = ({ r, g, b }: { r: number; g: number; b: number }) =>
  `#${[r, g, b]
    .map((value) =>
      Math.round(Math.min(255, Math.max(0, value)))
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`;

const mixWithWhite = (color: string, whiteRatio: number) => {
  const rgb = hexToRgb(color);

  return rgbToHex({
    r: rgb.r + (255 - rgb.r) * whiteRatio,
    g: rgb.g + (255 - rgb.g) * whiteRatio,
    b: rgb.b + (255 - rgb.b) * whiteRatio,
  });
};

export const createCategoryColorTheme = (baseColor: string) => {
  const normalizedBaseColor = normalizeHexColor(baseColor);

  return {
    accent: normalizedBaseColor,
    themeBase: normalizedBaseColor,
    themeMid: mixWithWhite(normalizedBaseColor, 0.54),
    themeLight: mixWithWhite(normalizedBaseColor, 0.86),
  };
};

export type Friend = { id: number; name: string };

export const DUMMY_FRIENDS: Friend[] = [
  { id: 1, name: "담검이" },
  { id: 2, name: "조료" },
  { id: 3, name: "민식이" },
  { id: 4, name: "페블이" },
  { id: 5, name: "짱구" },
];
