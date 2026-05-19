import Constants from "expo-constants";
import { Platform } from "react-native";

/** Mac/PC IP from Expo Metro (e.g. 192.168.1.5:8081) — same machine as Laravel in dev. */
function getExpoDevMachineHost(): string | null {
  const debuggerHost =
    Constants.expoGoConfig?.debuggerHost ??
    Constants.manifest2?.extra?.expoGo?.debuggerHost ??
    Constants.expoConfig?.hostUri;

  if (!debuggerHost || typeof debuggerHost !== "string") return null;

  const host = debuggerHost.split(":")[0]?.trim();
  if (!host || host === "localhost" || host === "127.0.0.1") return null;

  return host;
}

function getDefaultApiBaseUrl() {
  // Web: follow whatever host served the app (localhost or your LAN IP).
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

  // Physical iPhone: 127.0.0.1 is the phone, not your Mac — use Metro's host IP.
  const devHost = getExpoDevMachineHost();
  if (devHost) return `http://${devHost}:8000/api`;

  // iOS simulator (or fallback)
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

