import apiRequest from './main';

export const login = async (username, password) => {
  
    const params = new URLSearchParams();
    params.append('grant_type', 'password');
    params.append('username', username);
    params.append('password', password);
  
    return await apiRequest('POST', '/login', params, false, {
        'Content-Type': 'application/x-www-form-urlencoded',
        "Access-Control-Allow-Origin": "*"
    });
};

export const loginWithRefreshToken = async (refreshToken) => {
    const params = new URLSearchParams();
    params.append('refresh_token', refreshToken); 

    return await apiRequest('POST', '/refresh', params, false, {
        'Content-Type': 'application/x-www-form-urlencoded',
    });
}

export const createAccount = async (last_name, first_name, email, password) => {
    return await apiRequest('POST', '/signup', {
        email,
        last_name,
        first_name,
        password
    });
}

export const refreshToken = async (refreshToken) => {
    const params = new URLSearchParams();
    params.append('refresh_token', refreshToken); 

    return await apiRequest('POST', '/refresh', params, false, {
        'Content-Type': 'application/x-www-form-urlencoded',
    });
}

export const sendCode = async (code, email) => {
    return await apiRequest('POST', '/auth/check-code', {
        code,
        email
    });
}

export const resendCode = async (email) => {
    return await apiRequest('POST', '/auth/resend-code', {
        email
    });
}

export const sendPasswordResetEmail = async (email) => {
    return await apiRequest('POST', '/auth/forgot-password', {
        email
    });
}

export const sendNewPassword = async (token, password) => {
    return await apiRequest('POST', '/auth/reset-password', {
        token,
        password
    });
}