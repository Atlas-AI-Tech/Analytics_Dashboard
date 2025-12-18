// Base URLs for Lentra V2 (existing behaviour)
export const prodUrl = "https://uat-integrations.kreditmind.com/v2";
export const devUrl = "http://localhost:5000/v2";

export const currentUrl = prodUrl;

export const lentra_documents = [
  "PAN",
  "GST_CERT",
  "UDYAM_CERT",
  "EBILL",
  "BANK_STATEMENT",
  "SHOP_ACT_LICENSE",
  "FSSAI_CERTIFICATE",
  "PURCHASE_ORDER",
  "AADHAAR",
  "RENT_AGREEMENT",
  "INDEX_2",
  "MARGIN_MONEY_RECEIPT",
  "DEBIT_NOTE",
  "INSURANCE",
  "INVOICE",
  "RTO_FORM_26",
  "RTO_FORM_29",
  "RTO_FORM_30",
  "RTO_FORM_34",
  "RTO_FORM_35",
  "SATBARA",
  "SALE_DEED",
  "GAVTHAN_CERTIFICATE",
  "GUNTHEWARI_CERTIFICATE",
  "GIFT_DEED",
  "NAMUNA_8",
  "CHATUSIMA",
  "TAX_INVOICE",
  "ACH_FORM",
];

// ---------------------------------------------------------------------------
// Sandbox / Environment / Product configuration
// ---------------------------------------------------------------------------

// Environments – currently we always use "prod" but keep local for future use
export const ENVIRONMENTS = {
  LOCAL: "local",
  PROD: "prod",
};

export const DEFAULT_ENVIRONMENT = ENVIRONMENTS.PROD;

// Sandbox types for the Analytics dashboards
export const SANDBOXES = {
  LENTRA: "lentra",
  ATLAS: "atlas",
};

// Product types supported by the dashboards
export const PRODUCT_TYPES = {
  LENTRA_V2: "lentra_v2",
  PFL_CDL: "pfl_cdl",
};

// ---------------------------------------------------------------------------
// Lentra V2 analytics links (per sandbox & environment)
// ---------------------------------------------------------------------------

// Base URLs per sandbox for Lentra V2
export const lentraV2BaseLinks = {
  [SANDBOXES.LENTRA]: {
    [ENVIRONMENTS.PROD]: prodUrl, // existing production URL
    [ENVIRONMENTS.LOCAL]: devUrl, // existing local URL
  },
  [SANDBOXES.ATLAS]: {
    // Dummy URLs for now – can be updated independently later
    [ENVIRONMENTS.PROD]: prodUrl,
    [ENVIRONMENTS.LOCAL]: devUrl,
  },
};

export const lentraV2AnalyticsPath = "/verification/analytics";

export const getLentraV2BaseUrl = (
  sandbox = SANDBOXES.LENTRA,
  environment = DEFAULT_ENVIRONMENT
) => {
  return (
    lentraV2BaseLinks[sandbox]?.[environment] ??
    lentraV2BaseLinks[SANDBOXES.LENTRA][ENVIRONMENTS.PROD]
  );
};

// ---------------------------------------------------------------------------
// PFL CDL analytics links (per sandbox & environment)
// ---------------------------------------------------------------------------

// Base URLs per sandbox for PFL CDL
export const pflCdlBaseLinks = {
  [SANDBOXES.LENTRA]: {
    // Existing URLs used in PFL CDL dashboard
    [ENVIRONMENTS.PROD]: "https://7104365897544.serviceurl.in",
    [ENVIRONMENTS.LOCAL]: "http://localhost:5000",
  },
  [SANDBOXES.ATLAS]: {
    // Dummy URLs for now – can be updated independently later
    [ENVIRONMENTS.PROD]: "https://lentra-loss.dev.kreditmind.com",
    [ENVIRONMENTS.LOCAL]: "http://localhost:7002",
  },
};

export const pflCdlSummaryPath =
  "/v3/verification/analytics/documents/summary";

export const getPflCdlSummaryUrl = (
  sandbox = SANDBOXES.LENTRA,
  environment = DEFAULT_ENVIRONMENT
) => {
  const base =
    pflCdlBaseLinks[sandbox]?.[environment] ??
    pflCdlBaseLinks[SANDBOXES.LENTRA][ENVIRONMENTS.PROD];

  return `${base}${pflCdlSummaryPath}`;
};

// ---------------------------------------------------------------------------
// Latency tracker specific endpoints
// ---------------------------------------------------------------------------

// Lentra V2 flow latency (per sandbox & environment)
export const lentraV2FlowFilesPath = "/verification/analytics/flow-files";
export const lentraV2FlowMediansPath = "/verification/analytics/flow-medians";

export const getLentraV2FlowFilesUrl = (
  sandbox = SANDBOXES.LENTRA,
  environment = DEFAULT_ENVIRONMENT
) => {
  const base = getLentraV2BaseUrl(sandbox, environment);
  return `${base}${lentraV2FlowFilesPath}`;
};

export const getLentraV2FlowMediansUrl = (
  sandbox = SANDBOXES.LENTRA,
  environment = DEFAULT_ENVIRONMENT
) => {
  const base = getLentraV2BaseUrl(sandbox, environment);
  return `${base}${lentraV2FlowMediansPath}`;
};

// LOS / PFL CDL latency analytics (per sandbox & environment)
// We piggyback on the existing PFL CDL base links for consistency.
export const losAnalyticsPath = "/v3/verification/analytics";

export const getLosAnalyticsBaseUrl = (
  sandbox = SANDBOXES.LENTRA,
  environment = DEFAULT_ENVIRONMENT
) => {
  const base =
    pflCdlBaseLinks[sandbox]?.[environment] ??
    pflCdlBaseLinks[SANDBOXES.LENTRA][ENVIRONMENTS.PROD];
  return base;
};

export const getLosAnalyticsUrl = (
  sandbox = SANDBOXES.LENTRA,
  environment = DEFAULT_ENVIRONMENT
) => {
  const base = getLosAnalyticsBaseUrl(sandbox, environment);
  return `${base}${losAnalyticsPath}`;
};
