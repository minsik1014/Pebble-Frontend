// src/features/settings/constants/bridgeColorPalettes.ts

export interface BridgeColorPalette {
  id: string;
  name: string;
  tone: string;
  colors: {
    empty: string;
    level1: string;
    level2: string;
    level3: string;
  };
}

export const DEFAULT_BRIDGE_PALETTE_ID = 'pebble';

export const BRIDGE_COLOR_PALETTES: BridgeColorPalette[] = [
  {
    id: 'pebble',
    name: '조약돌',
    tone: '기본',
    colors: {
      empty: '#FAFAFA',
      level1: '#E5E5E5',
      level2: '#A3A3A3',
      level3: '#171717',
    },
  },
  {
    id: 'stream',
    name: '시냇물',
    tone: '파랑',
    colors: {
      empty: '#FAFAFA',
      level1: '#D5E1FF',
      level2: '#82A0FF',
      level3: '#2343DB',
    },
  },
  {
    id: 'sprout',
    name: '새싹',
    tone: '초록',
    colors: {
      empty: '#FAFAFA',
      level1: '#D2F2C4',
      level2: '#ABE692',
      level3: '#7ED957',
    },
  },
  {
    id: 'sunshine',
    name: '햇살',
    tone: '노랑',
    colors: {
      empty: '#FAFAFA',
      level1: '#FFF1C1',
      level2: '#FFE48B',
      level3: '#FFD64D',
    },
  },
  {
    id: 'sunset',
    name: '노을',
    tone: '주황',
    colors: {
      empty: '#FAFAFA',
      level1: '#FFD7B8',
      level2: '#FFB67A',
      level3: '#FF8E33',
    },
  },
  {
    id: 'flower',
    name: '꽃',
    tone: '분홍',
    colors: {
      empty: '#FAFAFA',
      level1: '#FFD6D6',
      level2: '#FFB4B4',
      level3: '#FF8B8B',
    },
  },
];

export function getBridgePaletteById(paletteId: string) {
  return (
    BRIDGE_COLOR_PALETTES.find((palette) => palette.id === paletteId) ??
    BRIDGE_COLOR_PALETTES[0]
  );
}

export function getBridgePaletteColors(palette: BridgeColorPalette) {
  return [
    palette.colors.empty,
    palette.colors.level1,
    palette.colors.level2,
    palette.colors.level3,
  ];
}