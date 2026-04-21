const API_BASE_URL = "http://127.0.0.1:8000/api";

export type ApiRequestOptions = RequestInit & {
  headers?: Record<string, string>;
  body?: any;
};

export async function apiRequest(endpoint: string, options: ApiRequestOptions = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
    ...options,
  };

  if (
    (config as any).body &&
    typeof (config as any).body === "object" &&
    !((config as any).body instanceof FormData)
  ) {
    (config as any).body = JSON.stringify((config as any).body);
  }

  const response = await fetch(url, config);

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

