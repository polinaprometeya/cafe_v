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

