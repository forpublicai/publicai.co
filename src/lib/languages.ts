export const LANGUAGES = [
  { code: "de", label: "DE", name: "German" },
  { code: "fr", label: "FR", name: "French" },
  { code: "it", label: "IT", name: "Italian" },
  { code: "en", label: "EN", name: "English" },
] as const;

export type LanguageCode = (typeof LANGUAGES)[number]["code"];

export function getLanguageName(code: LanguageCode): string {
  return LANGUAGES.find((l) => l.code === code)?.name ?? "English";
}

/** Map canton ID to its primary language */
export const cantonLanguageMap: Record<string, LanguageCode> = {
  ZH: "de",
  BE: "de",
  LU: "de",
  UR: "de",
  SZ: "de",
  OW: "de",
  NW: "de",
  GL: "de",
  ZG: "de",
  SO: "de",
  BS: "de",
  BL: "de",
  SH: "de",
  AR: "de",
  AI: "de",
  SG: "de",
  GR: "de",
  AG: "de",
  TG: "de",
  FR: "fr",
  VD: "fr",
  VS: "fr",
  NE: "fr",
  GE: "fr",
  JU: "fr",
  TI: "it",
};

/** Map known Swiss cities to canton IDs */
export const cityCantonMap: Record<string, string> = {
  zurich: "ZH",
  zürich: "ZH",
  winterthur: "ZH",
  bern: "BE",
  berne: "BE",
  thun: "BE",
  biel: "BE",
  bienne: "BE",
  lucerne: "LU",
  luzern: "LU",
  altdorf: "UR",
  schwyz: "SZ",
  sarnen: "OW",
  stans: "NW",
  glarus: "GL",
  zug: "ZG",
  fribourg: "FR",
  freiburg: "FR",
  solothurn: "SO",
  basel: "BS",
  liestal: "BL",
  schaffhausen: "SH",
  herisau: "AR",
  appenzell: "AI",
  "st. gallen": "SG",
  "st gallen": "SG",
  chur: "GR",
  davos: "GR",
  aarau: "AG",
  baden: "AG",
  frauenfeld: "TG",
  lugano: "TI",
  bellinzona: "TI",
  locarno: "TI",
  lausanne: "VD",
  montreux: "VD",
  nyon: "VD",
  sion: "VS",
  neuchâtel: "NE",
  neuchatel: "NE",
  geneva: "GE",
  genève: "GE",
  geneve: "GE",
  delémont: "JU",
  delemont: "JU",
};

/** Resolve a city name (from Vercel geo headers) to a canton ID */
export function cityToCanton(city: string | null): string | null {
  if (!city) return null;
  return cityCantonMap[city.toLowerCase()] ?? null;
}
