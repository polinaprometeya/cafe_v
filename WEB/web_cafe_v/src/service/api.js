
const API_BASE_URL = "http://127.0.0.1:8000/api"

/**
 * Low-level fetch wrapper used by `src/service/routes.js`.
 *
 * Notes:
 * - Always sends JSON by default.
 * - Throws on non-2xx responses so callers can handle errors in UI.
 * - If you see repeated console logs, it's because we log request bodies here.
 *   You can remove the log once you're done debugging.
 */
async function apiRequest(endpoint, options = {}) {
    const { treat404AsSuccess = false, ...fetchOptions } = options;
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            ...fetchOptions.headers,
        },
        ...fetchOptions,
    };

    if (config.body && typeof config.body === 'object') {
        config.body = JSON.stringify(config.body)
        // Debug helper: shows what we send to backend.
        console.log(config.body)
    }

    try {
        const response = await fetch(url, config);

        if (response.status === 409) {
            return await response.text();
        }

        if (!response.ok) {
            if (treat404AsSuccess && response.status === 404) {
                return null;
            }
            // Try to extract a useful error body for debugging (Laravel often returns JSON).
            const contentType = response.headers.get("content-type");
            let body = null;

            try {
                if (contentType && contentType.includes("application/json")) {
                    body = await response.json();
                } else {
                    body = await response.text();
                }
            } catch {
                // ignore body parsing failures
            }

            const details =
                body && typeof body === "object"
                    ? JSON.stringify(body)
                    : String(body ?? "");

            throw new Error(`HTTP error! status: ${response.status}${details ? ` body: ${details}` : ""}`);
        }

        if (response.status === 204) {
            return null;
        }

        const contentType = response.headers.get("content-type");

        if (contentType && contentType.includes("application/json")) {
            return await response.json();
        } else {
            return await response.text();
        }

    } catch (error) {
        console.error('API request failed', error);
        throw error
    }
}

const api = { apiRequest };
export default api;