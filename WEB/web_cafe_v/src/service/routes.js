import api from "./api";

//Read 

export const getMenuByCategory = () => api.get("/category");

//RESERVATION CRUD

export const createReservation = async (reservationInfo) => {
    return apiRequest('/Reservation/addReservation', {
        method: 'POST',
        body: reservationInfo,
    });
}

