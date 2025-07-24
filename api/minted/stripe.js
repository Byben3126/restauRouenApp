import apiRequest from './main';


export const createSubscription = async() => {
    return await apiRequest('POST', `/stripe/create-subscription`, {}, null, true);
}

export const updateRenewalSubscription = async(isCanceled) => {
    return await apiRequest('PATCH', `/stripe/update-renewal-subscription`, {
        cancel_at_period_end: isCanceled
    }, null, true);
}

export const addPaymentMethod = async(payment_method_id) => {
    return await apiRequest('POST', `/stripe/add-payment-method`, {
        payment_method_id
    }, null, true);
}

export const createSetupIntent = async() => {
    return await apiRequest('POST', `/stripe/create-setup-intent`, {}, null, true);
}

export const getPaymentMethods = async() => {
    return await apiRequest('GET', `/stripe/payment-methods`, null, null, true);
}

export const detachPaymentMethod = async(idMethod) => {
    return await apiRequest('DELETE', `/stripe/detach-payment-method/${idMethod}`, null, null, true);
}


export const setDefaultPaymentMethod = async(payment_method_id) => {
    return await apiRequest('POST', `/stripe/set-default-payment-method`, {
        payment_method_id
    }, null, true);
}






