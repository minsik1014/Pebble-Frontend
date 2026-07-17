export const CATEGORY_COLORS = [
  "bg-theme-1-base",
  "bg-theme-2-base",
  "bg-theme-3-base",
  "bg-theme-4-base",
  "bg-theme-5-base",
  "bg-theme-6-base",
];

export const CATEGORY_COLOR_THEMES = [
  {
    accent: "#00cef5",
    themeBase: "bg-theme-1-base",
    themeMid: "bg-theme-1-mid",
    themeLight: "bg-theme-1-light",
  },
  {
    accent: "#30b26b",
    themeBase: "bg-theme-2-base",
    themeMid: "bg-theme-2-mid",
    themeLight: "bg-theme-2-light",
  },
  {
    accent: "#ff7580",
    themeBase: "bg-theme-3-base",
    themeMid: "bg-theme-3-mid",
    themeLight: "bg-theme-3-light",
  },
  {
    accent: "#b983ff",
    themeBase: "bg-theme-4-base",
    themeMid: "bg-theme-4-mid",
    themeLight: "bg-theme-4-light",
  },
  {
    accent: "#ffdd47",
    themeBase: "bg-theme-5-base",
    themeMid: "bg-theme-5-mid",
    themeLight: "bg-theme-5-light",
  },
  {
    accent: "#ff9f43",
    themeBase: "bg-theme-6-base",
    themeMid: "bg-theme-6-mid",
    themeLight: "bg-theme-6-light",
  },
];

export type Friend = { id: number; name: string };

export const DUMMY_FRIENDS: Friend[] = [
  { id: 1, name: "담검이" },
  { id: 2, name: "조료" },
  { id: 3, name: "민식이" },
  { id: 4, name: "페블이" },
  { id: 5, name: "짱구" },
];
