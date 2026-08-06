import api from './api.js';

export const loginuser = (name,email) => {
    return api.post('/auth/login',{email,password})
}

export const registeruser = (name,email,password) => {
    return api.post('/auth/register',{name,email,password})
}

export const logoutuser = () => {
    return api.post('/auth/logout')
}

export const refreshuser = () => {
    return api.post('auth/refresh')
}
