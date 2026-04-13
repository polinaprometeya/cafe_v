
const API_BASE_URL = "http://127.0.0.1:8000/api"

async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options,
    };

    if (config.body && typeof config.body === 'object') {
        config.body = JSON.stringify(config.body)
        console.log(config.body)
    }

    try {
        const response = await fetch(url, config);

        if (response.status === 409) {
            return await response.text();
        }

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
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

export default {
    apiRequest,
};