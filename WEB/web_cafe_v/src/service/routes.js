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


// DISH CRUD!

// Create
export const createDish = async (dishData) => {
    return apiRequest('/Dish/addDish', {
        method: 'POST',
        body: dishData,
    });
}

// READ
export const getDishes = async () => {
    return apiRequest('/Dish/getAllDishes');
}

export const getDishById = async (id) => {
    return apiRequest(`/Dish/${id}/getDishById`);
}

// UPDATE
export const updateDish = async (id, dishData) => {
    return apiRequest(`/Dish/${id}/editDish`, {
        method: 'PUT',
        body: dishData,
    });
}

// DELETE
export const deleteDish = async (id) => {
    return apiRequest(`/Dish/${id}/removeDish`, {
        method: 'DELETE',
    });
}

