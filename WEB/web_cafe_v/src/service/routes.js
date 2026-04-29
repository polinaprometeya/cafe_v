import api from "./api";

/**
 * API route helpers.
 *
 * These functions document the backend contract in one place.
 * Keep them thin: payload mapping happens in the page components.
 */

export const getMenuByCategory = () => api.apiRequest("/category");

// Reservation create (final step)

export const createReservation = async (payload) => {
    return api.apiRequest('/reservation', {
        method: 'POST',
        body: payload,
    });
}

// Reservation hold (temporary lock) - calls stored procedure on backend

export const holdReservation = async (payload) => {
    return api.apiRequest('/reservation-holds', {
        method: 'POST',
        body: payload,
    });
}

export const releaseReservationHold = async (holdId) => {
    return api.apiRequest(`/reservation-holds/${holdId}`, {
        method: 'DELETE',
    });
}

// Availability check - returns available table IDs
export const tableAvailability = async (payload) => {
    return api.apiRequest('/tables/availability', {
        method: 'POST',
        body: payload,
    });
}
