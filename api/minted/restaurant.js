import apiRequest from './main';

// Récupérer les informations du restaurant de l'utilisateur connecté
export const getMyRestaurant = async () => {
    return await apiRequest('GET', '/users/me/restaurant', null, null, true);
};

export const getRestaurant = async (id) => {
    return await apiRequest('GET', `/restaurant/${id}`, null, null, true);
};

export const searchRestaurants = async (query) => {
    return await apiRequest('GET', `/restaurants/search?q=${encodeURIComponent(query)}`, null, null, true);
};

export const getNearByRestaurants = async (latitude,longitude,radius,limit) => {

    const paramsObject = {
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        radius: radius.toString(),
   
    }

    if (limit) paramsObject.limit = limit.toString();

    const params = new URLSearchParams(paramsObject);
    
    return await apiRequest('GET', `/restaurants/nearby?${params.toString()}`, null, null, true);
  
}

export const getTopRestaurants = async () => {
    return await apiRequest('GET', '/users/me/top-restaurant', null, null, true);
}

export const getLastVisitedCustomersWithRestaurants = async () => {
    return await apiRequest('GET', '/users/me/last-visited-restaurants', null, null, true);
}

// Créer un restaurant pour l'utilisateur connecté
export const createMyRestaurant = async (restaurantData) => {
    return await apiRequest('POST', '/users/me/restaurant', restaurantData, null, true);
};

// Mettre à jour les informations du restaurant de l'utilisateur connecté
export const updateMyRestaurant = async (restaurantData) => {
    return await apiRequest('PATCH', '/users/me/restaurant', restaurantData, null, true);
};

export const uploadImagesMyRestaurant=  async (files) => {
    const formData = new FormData();

    for (const file of files) {
        formData.append('files', file);
    }

    return await apiRequest('POST', '/users/me/restaurant/images', formData, null, true);
}

export const deleteImagesMyRestaurant=  async (path) => {

    return await apiRequest('DELETE', `/users/me/restaurant/images`, {
        path
    }, null, true);
}


// Supprimer le restaurant de l'utilisateur connecté
export const deleteMyRestaurant = async () => {
    return await apiRequest('DELETE', '/users/me/restaurant', null, null, true);
};

