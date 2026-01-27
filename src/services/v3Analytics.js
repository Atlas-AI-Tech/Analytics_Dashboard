import {
  DEFAULT_ENVIRONMENT,
  getV3AnalyticsSummarySpreadsheetUrl,
  getV3AnalyticsUrl,
} from "../constant";

const tryParseJson = async (response) => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

const extractErrorMessage = (payload) => {
  if (!payload) return null;
  if (typeof payload === "string") return payload;
  if (typeof payload.message === "string") return payload.message;
  if (typeof payload.error === "string") return payload.error;
  if (typeof payload.detail === "string") return payload.detail;
  return null;
};

export const fetchV3Analytics = async ({
  sandbox,
  environment = DEFAULT_ENVIRONMENT,
  view,
  status,
  pageNumber,
}) => {
  if (!view || !status || !pageNumber) {
    throw new Error("Missing required analytics parameters");
  }

  const baseUrl = getV3AnalyticsUrl(sandbox, environment);
  const searchParams = new URLSearchParams({
    view: String(view),
    status: String(status),
    page_number: String(pageNumber),
  });

  const url = `${baseUrl}?${searchParams.toString()}`;
  const response = await fetch(url);

  const payload = await tryParseJson(response);

  if (!response.ok) {
    const backendMessage = extractErrorMessage(payload);
    throw new Error(backendMessage || "Failed to fetch analytics data");
  }

  return payload;
};

export const fetchV3AnalyticsSummarySpreadsheet = async ({
  sandbox,
  environment = DEFAULT_ENVIRONMENT,
  view,
  status,
}) => {
  if (!view || !status) {
    throw new Error("Missing required analytics parameters");
  }

  const baseUrl = getV3AnalyticsSummarySpreadsheetUrl(sandbox, environment);
  const searchParams = new URLSearchParams({
    view: String(view),
    status: String(status),
  });

  const url = `${baseUrl}?${searchParams.toString()}`;
  const response = await fetch(url);

  const payload = await tryParseJson(response);

  if (!response.ok) {
    const backendMessage = extractErrorMessage(payload);
    throw new Error(backendMessage || "Failed to download spreadsheet");
  }

  return payload;
};

