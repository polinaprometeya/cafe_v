import { Platform } from "react-native";

function getDefaultApiBaseUrl() {
  // Web: follow whatever host served the app (localhost or your LAN IP).
  // This avoids hardcoding a changing LAN IP during dev.
  if (Platform.OS === "web") {
    const hostname =
      typeof globalThis !== "undefined" &&
      "location" in globalThis &&
      globalThis.location &&
      typeof globalThis.location.hostname === "string" &&
      globalThis.location.hostname.length > 0
        ? globalThis.location.hostname
        : "localhost";

    return `http://${hostname}:8000/api`;
  }

  // Android emulator -> host machine
  if (Platform.OS === "android") return "http://10.0.2.2:8000/api";

  // iOS simulator -> host machine
  return "http://127.0.0.1:8000/api";
}

const DEFAULT_API_BASE_URL = getDefaultApiBaseUrl();

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE_URL;

export type ApiRequestOptions = Omit<RequestInit, "headers" | "body"> & {
  headers?: Record<string, string>;
  body?: unknown;
};

export async function apiRequest(endpoint: string, options: ApiRequestOptions = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const { body, headers, ...rest } = options;
  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...(headers ?? {}),
    },
    ...rest,
    body: body as any,
  };

  if (
    (config as any).body &&
    typeof (config as any).body === "object" &&
    !((config as any).body instanceof FormData)
  ) {
    (config as any).body = JSON.stringify((config as any).body);
  }

  let response: Response;
  try {
    response = await fetch(url, config);
  } catch (err) {
    // This is the case you’re seeing: "Network request failed" (no HTTP response at all).
    throw new Error(
      `Network request failed for ${url}. ` +
        `If you are on a device/emulator, check the backend host/port and that it is running. ` +
        `Original error: ${String(err)}`
    );
  }

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(
      `HTTP error! status: ${response.status}${errorText ? ` - ${errorText}` : ""}`
    );
  }

  if (response.status === 204) return null;

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return await response.json();
  }
  return await response.text();
}

