import api from './api.js';

export const loginuser = (name,email) => {
    api.post('/auth/login',{email,password})
}

export const registeruser = (name,email,password) => {
    api.post('/auth/register',{name,email,password})
}