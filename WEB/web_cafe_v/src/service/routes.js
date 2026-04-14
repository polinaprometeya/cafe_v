import api from "./api";

//Read 

export const getMenuByCategory = () => api.apiRequest("/category");

//RESERVATION CRUD

export const createReservation = async (reservationInfo) => {
    return api.apiRequest('/Reservation/addReservation', {
        method: 'POST',
        body: reservationInfo,
    });
}

