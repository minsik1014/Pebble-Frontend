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
      level1: '#D7E4FF',
      level2: '#7C9CFF',
      level3: '#2F49D8',
    },
  },
  {
    id: 'sprout',
    name: '새싹',
    tone: '초록',
    colors: {
      empty: '#FAFAFA',
      level1: '#CFF2C3',
      level2: '#9BDF83',
      level3: '#6FD34F',
    },
  },
  {
    id: 'sunshine',
    name: '햇살',
    tone: '노랑',
    colors: {
      empty: '#FAFAFA',
      level1: '#FFF0B8',
      level2: '#FFE07A',
      level3: '#FFCF42',
    },
  },
  {
    id: 'sunset',
    name: '노을',
    tone: '주황',
    colors: {
      empty: '#FAFAFA',
      level1: '#FFD0AD',
      level2: '#FFA766',
      level3: '#FF7F2A',
    },
  },
  {
    id: 'flower',
    name: '꽃',
    tone: '분홍',
    colors: {
      empty: '#FAFAFA',
      level1: '#FFD1D1',
      level2: '#FFA3A7',
      level3: '#FF7C82',
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