export type RegulationId =
  | "lcr"
  | "nsfr"
  | "almm"
  | "irl"
  | "uk-pra"
  | "us-fed"
  | "canada-osfi"
  | "switzerland-finma"
  | "peru"
  | "panama"
  | "mexico-cnbv"
  | "brazil-bcb"
  | "japan-bsr"
  | "singapore-mas"
  | "hongkong-hkma"
  | "australia-apra"
  | "indonesia-ojk"
  | "malaysia-bnm"
  | "vietnam-sbv"
  | "thailand-bot";

export type JurisdictionId =
  | "eu"
  | "uk"
  | "us"
  | "ca"
  | "ch"
  | "pe"
  | "pa"
  | "mx"
  | "br"
  | "jp"
  | "sg"
  | "hk"
  | "au"
  | "id"
  | "my"
  | "vn"
  | "th"
  | "co";

export interface Regulation {
  id: RegulationId;
  label: string;
  shortLabel: string;
  framework: string;
  jurisdictionId: JurisdictionId;
}

export interface Jurisdiction {
  id: JurisdictionId;
  label: string;
  cc: string;
}

export const JURISDICTIONS: Jurisdiction[] = [
  { id: "eu", label: "European Union", cc: "eu" },
  { id: "uk", label: "United Kingdom", cc: "uk" },
  { id: "us", label: "United States", cc: "us" },
  { id: "ca", label: "Canada", cc: "ca" },
  { id: "ch", label: "Switzerland", cc: "ch" },
  { id: "pe", label: "Peru", cc: "pe" },
  { id: "pa", label: "Panama", cc: "pa" },
  { id: "mx", label: "Mexico", cc: "mx" },
  { id: "br", label: "Brazil", cc: "br" },
  { id: "jp", label: "Japan", cc: "jp" },
  { id: "sg", label: "Singapore", cc: "sg" },
  { id: "hk", label: "Hong Kong", cc: "hk" },
  { id: "au", label: "Australia", cc: "au" },
  { id: "id", label: "Indonesia", cc: "id" },
  { id: "my", label: "Malaysia", cc: "my" },
  { id: "vn", label: "Vietnam", cc: "vn" },
  { id: "th", label: "Thailand", cc: "th" },
  { id: "co", label: "Colombia", cc: "co" },
];

export const REGULATIONS: Regulation[] = [
  {
    id: "lcr",
    label: "Liquidity Coverage Ratio",
    shortLabel: "LCR",
    framework: "CRR II / Basel III",
    jurisdictionId: "eu",
  },
  {
    id: "nsfr",
    label: "Net Stable Funding Ratio",
    shortLabel: "NSFR",
    framework: "CRR II / Basel III",
    jurisdictionId: "eu",
  },
  {
    id: "almm",
    label: "Additional Liquidity Monitoring Metrics",
    shortLabel: "ALMM",
    framework: "CRR II",
    jurisdictionId: "eu",
  },
  {
    id: "irl",
    label: "Indicador de Riesgo de Liquidez",
    shortLabel: "IRL",
    framework: "Circular Externa 042 - SFC",
    jurisdictionId: "co",
  },
  {
    id: "uk-pra",
    label: "PRA Fundamental Rules",
    shortLabel: "UK PRA",
    framework: "PRA Rulebook",
    jurisdictionId: "uk",
  },
  {
    id: "us-fed",
    label: "Federal Reserve Liquidity Standards",
    shortLabel: "US Fed",
    framework: "Regulation YY",
    jurisdictionId: "us",
  },
  {
    id: "canada-osfi",
    label: "OSFI Liquidity Adequacy Requirements",
    shortLabel: "OSFI LAR",
    framework: "LAR Guideline",
    jurisdictionId: "ca",
  },
  {
    id: "switzerland-finma",
    label: "FINMA Liquidity Ordinance",
    shortLabel: "FINMA LiqO",
    framework: "LiqO-FINMA",
    jurisdictionId: "ch",
  },
  {
    id: "peru",
    label: "SBS Liquidity Requirements",
    shortLabel: "SBS Peru",
    framework: "Resolución SBS N° 9075",
    jurisdictionId: "pe",
  },
  {
    id: "panama",
    label: "SBP Liquidity Standards",
    shortLabel: "SBP Panama",
    framework: "Acuerdo 4-2013",
    jurisdictionId: "pa",
  },
  {
    id: "mexico-cnbv",
    label: "CNBV Liquidity Coefficient",
    shortLabel: "CNBV",
    framework: "Circular Única de Bancos",
    jurisdictionId: "mx",
  },
  {
    id: "brazil-bcb",
    label: "BCB Liquidity Framework",
    shortLabel: "BCB",
    framework: "Resolução CMN 4.401",
    jurisdictionId: "br",
  },
  {
    id: "japan-bsr",
    label: "BSR Liquidity Coverage Standards",
    shortLabel: "BSR Japan",
    framework: "Basel III (Bank of Japan)",
    jurisdictionId: "jp",
  },
  {
    id: "singapore-mas",
    label: "MAS Notice 649 Liquidity",
    shortLabel: "MAS 649",
    framework: "MAS Notice 649",
    jurisdictionId: "sg",
  },
  {
    id: "hongkong-hkma",
    label: "HKMA Liquidity Maintenance Ratio",
    shortLabel: "HKMA LMR",
    framework: "Banking (Liquidity) Rules",
    jurisdictionId: "hk",
  },
  {
    id: "australia-apra",
    label: "APRA Prudential Standard APS 210",
    shortLabel: "APS 210",
    framework: "APS 210",
    jurisdictionId: "au",
  },
  {
    id: "indonesia-ojk",
    label: "OJK Liquidity Coverage Ratio",
    shortLabel: "OJK LCR",
    framework: "POJK No. 42/2015",
    jurisdictionId: "id",
  },
  {
    id: "malaysia-bnm",
    label: "BNM Liquidity Coverage Requirement",
    shortLabel: "BNM LCR",
    framework: "LCR Policy Document",
    jurisdictionId: "my",
  },
  {
    id: "vietnam-sbv",
    label: "SBV Liquidity Safety Ratios",
    shortLabel: "SBV",
    framework: "Circular 22/2019/TT-NHNN",
    jurisdictionId: "vn",
  },
  {
    id: "thailand-bot",
    label: "BOT Liquidity Coverage Ratio",
    shortLabel: "BOT LCR",
    framework: "BOT Notification 7/2558",
    jurisdictionId: "th",
  },
];

export const REGULATION_IDS: RegulationId[] = REGULATIONS.map((r) => r.id);
