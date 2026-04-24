import api from "./api";

//Read 

export const getMenuByCategory = () => api.apiRequest("/category");

//RESERVATION CRUD

//export const getReservations = () => api.apiRequest("/reservation");

export const createReservation = async (payload) => {
    return api.apiRequest('/reservation', {
        method: 'POST',
        body: payload,
    });
}

//Table Availability 

export const holdReservation = async (payload) => {
    return api.apiRequest('/reservation-holds', {
        method: 'POST',
        body: payload,
    });
}

export const tableAvailability = async (payload) => {
    return api.apiRequest('/tables/availability', {
        method: 'POST',
        body: payload,
    });
}
