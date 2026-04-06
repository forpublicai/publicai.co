export interface CantonData {
  id: string;
  name: string;
  nameFr: string;
  nameIt: string;
  participation: number;
  population: number;
}

export const cantonData: CantonData[] = [
  { id: "ZH", name: "Zürich", nameFr: "Zurich", nameIt: "Zurigo", participation: 1247, population: 1564662 },
  { id: "BE", name: "Bern", nameFr: "Berne", nameIt: "Berna", participation: 892, population: 1043132 },
  { id: "LU", name: "Luzern", nameFr: "Lucerne", nameIt: "Lucerna", participation: 312, population: 416347 },
  { id: "UR", name: "Uri", nameFr: "Uri", nameIt: "Uri", participation: 28, population: 36703 },
  { id: "SZ", name: "Schwyz", nameFr: "Schwyz", nameIt: "Svitto", participation: 98, population: 162157 },
  { id: "OW", name: "Obwalden", nameFr: "Obwald", nameIt: "Obvaldo", participation: 24, population: 38108 },
  { id: "NW", name: "Nidwalden", nameFr: "Nidwald", nameIt: "Nidvaldo", participation: 31, population: 43087 },
  { id: "GL", name: "Glarus", nameFr: "Glaris", nameIt: "Glarona", participation: 27, population: 40851 },
  { id: "ZG", name: "Zug", nameFr: "Zoug", nameIt: "Zugo", participation: 142, population: 129584 },
  { id: "FR", name: "Freiburg", nameFr: "Fribourg", nameIt: "Friburgo", participation: 218, population: 325496 },
  { id: "SO", name: "Solothurn", nameFr: "Soleure", nameIt: "Soletta", participation: 178, population: 277502 },
  { id: "BS", name: "Basel-Stadt", nameFr: "Bâle-Ville", nameIt: "Basilea Città", participation: 267, population: 196735 },
  { id: "BL", name: "Basel-Landschaft", nameFr: "Bâle-Campagne", nameIt: "Basilea Campagna", participation: 198, population: 292817 },
  { id: "SH", name: "Schaffhausen", nameFr: "Schaffhouse", nameIt: "Sciaffusa", participation: 54, population: 83107 },
  { id: "AR", name: "Appenzell Ausserrhoden", nameFr: "Appenzell Rh.-Ext.", nameIt: "Appenzello Esterno", participation: 35, population: 55445 },
  { id: "AI", name: "Appenzell Innerrhoden", nameFr: "Appenzell Rh.-Int.", nameIt: "Appenzello Interno", participation: 23, population: 16128 },
  { id: "SG", name: "St. Gallen", nameFr: "Saint-Gall", nameIt: "San Gallo", participation: 347, population: 514504 },
  { id: "GR", name: "Graubünden", nameFr: "Grisons", nameIt: "Grigioni", participation: 134, population: 200096 },
  { id: "AG", name: "Aargau", nameFr: "Argovie", nameIt: "Argovia", participation: 456, population: 694072 },
  { id: "TG", name: "Thurgau", nameFr: "Thurgovie", nameIt: "Turgovia", participation: 167, population: 282524 },
  { id: "TI", name: "Ticino", nameFr: "Tessin", nameIt: "Ticino", participation: 203, population: 350986 },
  { id: "VD", name: "Waadt", nameFr: "Vaud", nameIt: "Vaud", participation: 623, population: 815300 },
  { id: "VS", name: "Wallis", nameFr: "Valais", nameIt: "Vallese", participation: 187, population: 348503 },
  { id: "NE", name: "Neuenburg", nameFr: "Neuchâtel", nameIt: "Neuchâtel", participation: 112, population: 176496 },
  { id: "GE", name: "Genf", nameFr: "Genève", nameIt: "Ginevra", participation: 534, population: 506343 },
  { id: "JU", name: "Jura", nameFr: "Jura", nameIt: "Giura", participation: 47, population: 73709 },
];

export const totalParticipation = cantonData.reduce((sum, c) => sum + c.participation, 0);

export function getCantonById(id: string): CantonData | undefined {
  return cantonData.find((c) => c.id === id);
}

/** Mock per-topic agreement percentages for feedback cards */
export const topicInsights: Record<string, { topic: string; percentage: number; template: string }> = {
  privacy: {
    topic: "Privacy & Data",
    percentage: 68,
    template: "{pct}% of {canton} participants share your concern about data sovereignty",
  },
  governance: {
    topic: "Governance",
    percentage: 54,
    template: "{pct}% of participants in {canton} also favor citizen-led AI oversight",
  },
  access: {
    topic: "Access & Inclusion",
    percentage: 72,
    template: "{pct}% of {canton} residents agree AI should be accessible to everyone",
  },
  boundaries: {
    topic: "AI Boundaries",
    percentage: 61,
    template: "{pct}% of participants across Switzerland share similar views on AI limits",
  },
  culture: {
    topic: "Cultural Values",
    percentage: 58,
    template: "{pct}% of {canton} citizens want AI to reflect local cultural values",
  },
  trust: {
    topic: "Trust",
    percentage: 65,
    template: "{pct}% of Swiss participants share your level of trust in public AI",
  },
};
