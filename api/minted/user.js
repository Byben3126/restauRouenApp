import apiRequest from './main';

export const getUser = async () => {
    return await apiRequest('GET', '/users/me', null, null, true);
}

export const updateUser = async (userObject) => {
    return await apiRequest('PATCH', '/users/me', userObject, null, true);
}

export const getAccountsVinted = async() => {
    console.log('GetAccountVinted')
    return await apiRequest('GET', '/users/me/vinted_accounts/', null, null, true);
}

export const getLinkCodeToken = async() => {
    return await apiRequest('GET', '/users/me/link_code_token', null, null, true);
}




export const addAccountsVinted = async(email, access_token, refresh_token,  XAnonId, XDeviceUUID, userAgent) => {
    return await apiRequest('POST', '/users/me/vinted_accounts/', {
        email,
        access_token,
        refresh_token,
        XAnonId, 
        XDeviceUUID, 
        userAgent
    }, null, true);
}

export const updateAccountVinted = async(idVintedAccount, data) => {
    return await apiRequest('PATCH', `/users/me/vinted_accounts/${idVintedAccount}`, data, null, true);
}

export const deleteAccountsVinted = async(id) => {
    return await apiRequest('DELETE', `/users/me/vinted_accounts/${id}`, null, null, true);
}

export const getBotSettings = async() => {
    return await apiRequest('GET', '/users/me/bot_settings', null, null, true);
}

export const updateBotSettings = async(data) => {
    return await apiRequest('PATCH', '/users/me/bot_settings', data, null, true);
}

export const getDeliveries = async() => {
    return await apiRequest('GET', '/users/me/deliveries/', null, null, true);
}

export const deleteDelivery = async(id) => {
    return await apiRequest('DELETE', `/users/me/deliveries/${id}`, null, null, true);
}

export const addDelivery = async(data) => {
    return await apiRequest('POST', '/users/me/deliveries/', data, null, true);
}
